"""Simple logging service that appends JSONL logs for queries and feedback."""
import os
import json
from datetime import datetime


BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
LOGS_DIR = os.path.join(BASE_DIR, "logs")
os.makedirs(LOGS_DIR, exist_ok=True)

QUERY_LOG = os.path.join(LOGS_DIR, "query_log.jsonl")
FEEDBACK_LOG = os.path.join(LOGS_DIR, "feedback_log.jsonl")
ERROR_LOG = os.path.join(LOGS_DIR, "error_log.jsonl")


def _append_jsonl(path: str, obj: dict):
    with open(path, "a", encoding="utf-8") as fh:
        fh.write(json.dumps(obj, ensure_ascii=False) + "\n")


class LoggingService:
    def __init__(self):
        pass

    def log_query(self, question_id: str, question: str, answer: str, sources, backend: str, translated: bool = False, detected_language: str = "en", from_cache: bool = False):
        rec = {
            "timestamp": datetime.utcnow().isoformat(),
            "question_id": question_id,
            "question": question,
            "answer": answer,
            "sources": sources,
            "backend": backend,
            "translated": translated,
            "detected_language": detected_language,
            "from_cache": from_cache,
        }
        try:
            _append_jsonl(QUERY_LOG, rec)
        except Exception:
            pass

    def log_feedback(self, question_id: str, rating: int, comment: str = None):
        rec = {
            "timestamp": datetime.utcnow().isoformat(),
            "question_id": question_id,
            "rating": rating,
            "comment": comment,
        }
        try:
            _append_jsonl(FEEDBACK_LOG, rec)
        except Exception:
            pass

    def log_error(self, question_id: str = None, error: str = ""):
        rec = {
            "timestamp": datetime.utcnow().isoformat(),
            "question_id": question_id,
            "error": str(error),
        }
        try:
            _append_jsonl(ERROR_LOG, rec)
        except Exception:
            pass
