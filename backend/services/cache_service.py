"""Simple SQLite-backed key-value cache for small JSON blobs."""
import os
import json
import sqlite3
from typing import Optional


DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend_cache.db"))


class CacheService:
    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        self._ensure_db()

    def _ensure_db(self):
        conn = sqlite3.connect(self.db_path)
        try:
            conn.execute("""
            CREATE TABLE IF NOT EXISTS cache (
                key TEXT PRIMARY KEY,
                value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """)
            conn.commit()
        finally:
            conn.close()

    def get(self, key: str) -> Optional[dict]:
        conn = sqlite3.connect(self.db_path)
        try:
            cur = conn.execute("SELECT value FROM cache WHERE key = ?", (key,))
            row = cur.fetchone()
            if not row:
                return None
            return json.loads(row[0])
        except Exception:
            return None
        finally:
            conn.close()

    def set(self, key: str, value: dict):
        conn = sqlite3.connect(self.db_path)
        try:
            conn.execute("REPLACE INTO cache (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)", (key, json.dumps(value, ensure_ascii=False)))
            conn.commit()
        finally:
            conn.close()
