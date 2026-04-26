from __future__ import annotations

import os
import time
from typing import List, Optional
import requests
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Retrieve remote URL lazily; will raise if missing when initializing
from .env_utils import get_env_var
RAG_REMOTE_URL = get_env_var("RAG_REMOTE_URL", required=False)

class RAGService:

    def __init__(self) -> None:
        # Load configuration from environment
        self.remote_url: Optional[str] = RAG_REMOTE_URL
        self.remote_mode: bool = True
        # Fallback to mock only if explicitly enabled via env
        self.mock_mode: bool = os.getenv("RAG_ENABLE_FALLBACK", "false").lower() == "true"
        self.backend_name: str = "remote"
        self.initialized: bool = False

        # Configurable parameters
        self.timeout: int = int(os.getenv("RAG_REMOTE_TIMEOUT", "120"))
        self.max_retries: int = int(os.getenv("RAG_MAX_RETRIES", "3"))

        # diagnostics
        self.chunk_texts: List[str] = []
        self.index = None

    async def initialize(self) -> None:
        # Ensure remote URL is set unless fallback mock mode is enabled
        if not self.remote_url and not self.mock_mode:
            raise RuntimeError("❌ RAG_REMOTE_URL is NOT set and mock fallback is disabled.")
        print(f"✅ RAG initialized with remote: {self.remote_url}")
        self.initialized = True

    async def query(self, question: str, k: int = 3) -> dict:
        k = max(1, min(int(k or 3), 10))

        data = self._call_remote_with_retries(question, k)

        if data is None:
            return {
                "answer": "❌ Remote RAG unreachable",
                "sources": [],
                "backend": "error",
                "answer_local": None,
            }

        data["backend"] = data.get("backend", "remote")
        data["sources"] = self._normalize_sources(data.get("sources", []))
        data.setdefault("answer_local", None)
        data.setdefault("answer", "")

        return data

    def _call_remote_with_retries(self, question: str, k: int) -> Optional[dict]:
        url = self.remote_url.rstrip("/") + "/ask"
        payload = {"question": question, "k": k, "translate_local": False}

        print("🔗 Calling:", url)
        print("📦 Payload:", payload)

        attempt = 0
        max_retries = self.max_retries

        while attempt < max_retries:
            try:
                r = requests.post(url, json=payload, timeout=self.timeout, verify=False)
                r.raise_for_status()

                data = r.json()
                print("✅ REMOTE RESPONSE RECEIVED\n")

                return data

            except Exception as e:
                print("❌ REMOTE ERROR:", str(e))
                attempt += 1
                time.sleep(2 ** attempt)

        print("❌ ALL RETRIES FAILED\n")
        return {
            "answer": f"❌ Remote RAG unreachable: {self.remote_url}",
            "sources": [],
            "backend": "error",
            "confidence": None
        }

    def _normalize_sources(self, raw_sources) -> List[dict]:
        normalized: List[dict] = []

        if not raw_sources:
            return normalized

        for s in raw_sources:
            if isinstance(s, dict):
                normalized.append({
                    "text": s.get("text", ""),
                    "metadata": s.get("metadata", {})
                })
            elif isinstance(s, str):
                normalized.append({
                    "text": s,
                    "metadata": {"source": "remote"}
                })
            else:
                normalized.append({
                    "text": str(s),
                    "metadata": {"source": "unknown"}
                })

        return normalized