"""
FastAPI backend for AI Agriculture Advisor (RAG-based MVP)
"""
import sys
from pathlib import Path

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import uvicorn
import asyncio
from datetime import datetime
import uuid

from backend.services.rag_service import RAGService
from backend.services.translation_service import TranslationService
from backend.services.logging_service import LoggingService
from backend.services.cache_service import CacheService

app = FastAPI(title="AI Agriculture Advisor API", version="1.0.0")

# Demo-safe locked system prompt used for the `/ask` pipeline.
# This is intentionally fixed (not user-configurable).
SYSTEM_PROMPT = (
    "You are an agricultural advisory assistant for Ethiopian farmers.\n"
    "Rules:\n"
    "- Answer the question clearly and directly.\n"
    "- Use only the provided context.\n"
    "- If the context does not contain the answer, say: \"I could not find this information in the documents.\"\n"
    "- Do NOT copy random sentences.\n"
    "- Summarize the information in simple, practical language.\n"
    "- If the user asks in Amharic or Tigrinya, answer in the same language.\n"
    "- Prefer planting time, season, and months when applicable.\n"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
# RAG service: Set RAG_MOCK=true to use mock mode, otherwise loads real ML models
rag_service = RAGService()
translation_service = TranslationService()
logging_service = LoggingService()
cache_service = CacheService()


@app.on_event("startup")
async def startup_event():
    """FastAPI startup: initialize the RAG service once.

    This will attempt to load the FAISS index and embedding model. If initialization
    fails (missing deps, files), the service will fall back to mock mode so the API
    remains available.
    """
    try:
        await rag_service.initialize()
    except Exception as e:
        # Ensure startup doesn't crash; RAGService already handles fallback, but log anyway
        logging_service.log_error(question_id=None, error=f"RAG initialization failed: {e}")


# Request/Response models
class ChatRequest(BaseModel):
    question: str = Field(..., description="User's question")
    k: int = Field(default=3, ge=1, le=10, description="Number of sources to retrieve")
    translate_local: bool = Field(default=False, description="Enable translation for local languages")


class Source(BaseModel):
    text: str
    metadata: dict


class ChatResponse(BaseModel):
    answer: str
    backend: str
    sources: List[Source]
    question_id: str
    answer_local: Optional[str] = None


class FeedbackRequest(BaseModel):
    question_id: str
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5")
    comment: Optional[str] = None


class FeedbackResponse(BaseModel):
    message: str
    question_id: str


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    # include RAG remote/ML information
    ml_online = False
    remote_url = getattr(rag_service, "remote_url", None)
    # ml_online true if remote_mode and remote_url present
    try:
        ml_online = bool(getattr(rag_service, "remote_mode", False)) and bool(remote_url)
    except Exception:
        ml_online = False
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "agri-advisor-api",
        "ml_online": ml_online,
        "remote_url": remote_url,
    }


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint that processes questions through RAG pipeline.
    Supports translation for Amharic and Tigrigna (Ge'ez script).
    """
    try:
        question_id = str(uuid.uuid4())
        original_question = request.question
        processed_question = original_question
        translated = False
        detected_language = "en"
        
        # Check cache first
        cache_key = f"{original_question}_{request.k}_{request.translate_local}"
        cached_response = cache_service.get(cache_key)
        if cached_response:
            logging_service.log_query(
                question_id=question_id,
                question=original_question,
                answer=cached_response["answer"],
                sources=cached_response["sources"],
                backend=cached_response["backend"],
                translated=translated,
                detected_language=detected_language,
                from_cache=True
            )
            return ChatResponse(
                answer=cached_response["answer"],
                backend=cached_response["backend"],
                sources=[Source(**s) for s in cached_response["sources"]],
                question_id=question_id
            )
        
        # Normalize language before retrieval (demo-safe): detect Ge'ez and translate to English
        detected_language = translation_service.detect_geez_script(original_question)
        if detected_language in ["am", "ti"]:
            processed_question = translation_service.translate_to_english(original_question, detected_language)
            translated = True
        
        # Retrieval MUST embed only the clean user question (no system prompt)
        retrieval_question = processed_question

        # Get RAG response (k is handled and capped inside RAGService)
        rag_result = await rag_service.query(retrieval_question, k=request.k)

        # Ensure rag_result is a dict with expected keys (safety)
        if not isinstance(rag_result, dict):
            logging_service.log_error(question_id=question_id, error=f"Unexpected rag_result type: {type(rag_result)}")
            rag_result = {"answer": "", "sources": [], "backend": "remote-offline", "answer_local": None}
        # Enforce groundedness: if retrieval returned no sources, answer with a clear refusal
        if not rag_result.get("sources"):
            rag_result["answer"] = "I could not find this information in the documents."

        # Translate answer back if original was in local language
        final_answer = rag_result.get("answer") if rag_result.get("answer") is not None else ""
        if translated and final_answer:
            final_answer = translation_service.translate_from_english(final_answer, detected_language)
        
        # Format sources
        formatted_sources = [
            {
                "text": source.get("text", ""),
                "metadata": source.get("metadata", {})
            }
            for source in rag_result.get("sources", [])
        ]
        
        response_data = {
            "answer": final_answer,
            "backend": rag_result.get("backend", "mock-rag"),
            "sources": formatted_sources,
            "question_id": question_id,
            "answer_local": rag_result.get("answer_local") if rag_result.get("answer_local") is not None else None,
        }
        
        # Cache the response
        cache_service.set(cache_key, response_data)
        
        # Log the query
        logging_service.log_query(
            question_id=question_id,
            question=original_question,
            answer=final_answer,
            sources=formatted_sources,
            backend=rag_result.get("backend", "mock-rag"),
            translated=translated,
            detected_language=detected_language,
            from_cache=False
        )
        
        return ChatResponse(**response_data)
        
    except Exception as e:
        # Never return HTTP 500 for /chat; return a safe fallback response
        logging_service.log_error(question_id=question_id if 'question_id' in locals() else None, error=str(e))
        fallback = {
            "answer": "ML service error or internal error. Your question has been queued.",
            "backend": "error",
            "sources": [],
            "question_id": question_id if 'question_id' in locals() else str(uuid.uuid4()),
            "answer_local": None,
        }
        return ChatResponse(**fallback)


@app.post("/ask", response_model=ChatResponse)
async def ask_alias(request: ChatRequest):
    """Alias endpoint `/ask` to be compatible with remote ML API clients.

    This simply forwards to the same chat pipeline and returns identical
    response fields. Useful so the frontend can call `/ask` as requested.
    """
    return await chat(request)


@app.post("/debug/remote_preview")
async def debug_remote_preview(question: str, k: int = 3):
    """Hit the remote RAG directly and return raw response (for debugging)."""
    if not rag_service:
        raise HTTPException(status_code=500, detail="RAG service not configured")
    try:
        # _call_remote_with_retries is blocking; run in thread
        raw = await asyncio.to_thread(rag_service._call_remote_with_retries, question, k)
        return {"ok": True, "raw": raw}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/debug/flush_queue")
async def debug_flush_queue(background: BackgroundTasks):
    """Trigger a background flush of queued requests. Returns immediately."""
    if not rag_service:
        raise HTTPException(status_code=500, detail="RAG service not configured")
    background.add_task(rag_service.flush_pending_requests)
    return {"ok": True, "msg": "Flush scheduled"}


@app.post("/feedback", response_model=FeedbackResponse)
async def feedback(request: FeedbackRequest):
    """Store user feedback for a question"""
    try:
        logging_service.log_feedback(
            question_id=request.question_id,
            rating=request.rating,
            comment=request.comment
        )
        return FeedbackResponse(
            message="Feedback received",
            question_id=request.question_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error storing feedback: {str(e)}")


@app.get("/rag_status")
async def rag_status():
    """Return lightweight status of the RAG service for diagnostics.

    Shows whether the service initialized, whether it's in mock mode, and counts
    of loaded chunks / index vectors when available.
    """
    try:
        idx_count = None
        if getattr(rag_service, "index", None) is not None:
            try:
                idx_count = int(getattr(rag_service.index, "ntotal", -1))
            except Exception:
                idx_count = None

        return {
            "initialized": bool(rag_service.initialized),
            "mock_mode": bool(rag_service.mock_mode),
            "chunks_loaded": len(rag_service.chunk_texts) if getattr(rag_service, "chunk_texts", None) is not None else 0,
            "index_count": idx_count,
            "backend": rag_service.backend_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading RAG status: {e}")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

