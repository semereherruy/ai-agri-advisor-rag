"""
Robust RAG service wrapper for the backend.

This minimal implementation supports:
- Remote mode: forwards requests to a remote ML API (RAG_REMOTE_URL)
- Mock mode: returns canned answers if remote is disabled/unavailable
- Offline queue: persists unsent questions and can flush when remote returns

Designed to match usage in backend/app/main.py.
"""

from __future__ import annotations

import os
import time
import sqlite3
from typing import List, Optional

import requests

# Environment configuration
RAG_REMOTE_URL = os.getenv("RAG_REMOTE_URL")  # e.g., http://localhost:8001
RAG_MOCK = os.getenv("RAG_MOCK", "false").lower() in {"1", "true", "yes", "y"}

# Persistent queue database (in backend/ directory)
QUEUE_DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "rag_queue.db"))


class RAGService:
    """Minimal RAG service compatible with main.py usage.

    Attributes used by main.py:
      - initialized: bool
      - mock_mode: bool
      - backend_name: str
      - remote_mode: bool
      - remote_url: Optional[str]
      - chunk_texts: List[str] (present for diagnostics)
      - index: Optional[object] (present for diagnostics; kept as None)
    """

    def __init__(self) -> None:
        self.remote_url: Optional[str] = RAG_REMOTE_URL
        self.remote_mode: bool = bool(self.remote_url) and not RAG_MOCK
        self.mock_mode: bool = RAG_MOCK or not self.remote_mode
        self.backend_name: str = "remote" if self.remote_mode else "mock-rag"
        self.initialized: bool = False

        # Diagnostics fields expected by /rag_status
        self.chunk_texts: List[str] = []
        self.index = None

        # queue db path
        self._queue_db = QUEUE_DB_PATH

    async def initialize(self) -> None:
        """Initialize service (create queue DB)."""
        self._init_queue_db()
        self.initialized = True

    async def query(self, question: str, k: int = 3) -> dict:
        """Main query entrypoint.

        - If remote mode: call remote with retries; if unavailable, queue and return offline stub
        - If mock mode: return a canned response
        """
        k = max(1, min(int(k or 3), 10))
        if self.remote_mode and self.remote_url:
            data = self._call_remote_with_retries(question, k)
            if data is not None:
                # normalize
                data["backend"] = data.get("backend", "remote")
                data["sources"] = self._normalize_sources(data.get("sources", []))
                data.setdefault("answer_local", None)
                data.setdefault("answer", "")
                return data
            # Remote offline: queue and return stub
            self._queue_request(question, k)
            return self._remote_offline_stub(question, k)
        # Mock mode
        return self._mock_query(question, k)

    # The following helpers are synchronous; main.py calls via asyncio.to_thread when needed
    def _call_remote_with_retries(self, question: str, k: int) -> Optional[dict]:
        if not self.remote_url:
            return None
        # Use /ask endpoint convention
        url = self.remote_url.rstrip("/") + "/ask"
        payload = {"question": question, "k": k, "translate_local": False}
        attempt = 0
        max_retries = 3
        backoff = 1.0
        while attempt < max_retries:
            try:
                r = requests.post(url, json=payload, timeout=15)
                r.raise_for_status()
                try:
                    data = r.json()
                except Exception:
                    text = r.text or ""
                    data = {"answer": text, "sources": [], "backend": "remote-raw", "answer_local": None}
                data["sources"] = self._normalize_sources(data.get("sources", []))
                return data
            except Exception:
                attempt += 1
                time.sleep(backoff * (2 ** (attempt - 1)))
        return None

    def _normalize_sources(self, raw_sources) -> List[dict]:
        normalized: List[dict] = []
        if not raw_sources:
            return normalized
        for s in raw_sources:
            if isinstance(s, dict):
                normalized.append({"text": s.get("text", ""), "metadata": s.get("metadata", {})})
            elif isinstance(s, str):
                normalized.append({"text": s, "metadata": {"source": "remote"}})
            else:
                normalized.append({"text": str(s), "metadata": {"source": "remote-unknown"}})
        return normalized

    def flush_pending_requests(self) -> bool:
        try:
            self._flush_pending_requests()
            return True
        except Exception:
            return False

    # Queue management
    def _init_queue_db(self) -> None:
        conn = sqlite3.connect(self._queue_db)
        conn.execute(
            """CREATE TABLE IF NOT EXISTS pending (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question TEXT,
                k INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )"""
        )
        conn.commit()
        conn.close()

    def _flush_pending_requests(self) -> None:
        conn = sqlite3.connect(self._queue_db)
        try:
            cur = conn.cursor()
            cur.execute("SELECT id, question, k FROM pending ORDER BY created_at ASC")
            rows = cur.fetchall()
            for rid, question, k in rows:
                resp = self._call_remote_with_retries(question, k)
                if resp is not None:
                    cur.execute("DELETE FROM pending WHERE id=?", (rid,))
                    conn.commit()
                else:
                    break
        finally:
            conn.close()

    def _queue_request(self, question: str, k: int) -> None:
        conn = sqlite3.connect(self._queue_db)
        conn.execute("INSERT INTO pending (question, k) VALUES (?, ?)", (question, k))
        conn.commit()
        conn.close()

    # Fallback answers
    def _remote_offline_stub(self, question: str, k: int) -> dict:
        return {
            "answer": "ML service is offline. Your question has been queued.",
            "sources": [],
            "backend": "remote-offline",
            "answer_local": None,
        }

    def _mock_query(self, question: str, k: int = 3) -> dict:
        mock = [
            "Teff is typically planted during June–July in Ethiopian highlands.",
            "Maize requires timely planting and nitrogen fertilization.",
            "Improving soil organic matter boosts crop yield.",
        ]
        return {
            "answer": "\n\n".join(mock[: max(1, min(k, len(mock)))]),
            "sources": [],
            "backend": "mock-rag",
            "answer_local": None,
        }


# Optional helper retained for potential direct use
# Safer than raising at import time; returns a friendly error when no remote URL

def ask_rag_remote(question: str, k: int = 5) -> dict:
    if not RAG_REMOTE_URL:
        return {
            "answer": "Remote ML endpoint is not configured.",
            "sources": [],
            "error": "RAG_REMOTE_URL not set",
        }
    payload = {"question": question, "k": k}
    try:
        resp = requests.post(RAG_REMOTE_URL, json=payload, timeout=60)
        resp.raise_for_status()
        data = resp.json()
        assert "answer" in data, "Missing 'answer' from ML response"
        assert "sources" in data, "Missing 'sources' from ML response"
        return data
    except AssertionError as ae:
        return {
            "answer": "Sorry, the ML service returned an incomplete response. Please try again later.",
            "sources": [],
            "error": str(ae),
        }
    except requests.RequestException as re:
        return {
            "answer": "Sorry, the ML service is currently unavailable. Please try again soon.",
            "sources": [],
            "error": str(re),
        }
    except Exception as e:
        return {
            "answer": "An unexpected error occurred. Please try again later.",
            "sources": [],
            "error": str(e),
        }
