# Backend - AI Agriculture Advisor API

FastAPI backend for the AI Agriculture Advisor RAG system.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the development server:

**Option A - Using the run script:**
```bash
./run.sh
```

**Option B - Using uvicorn directly:**
```bash
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Option C - From project root:**
```bash
cd backend
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Important Notes:**
- Use `python3` not `python` (macOS default python is 2.7)
- The main file is at `app/main.py`
- Make sure you're in the `backend/` directory when running
- The module path is `app.main:app` (not `main:app`)

The API will be available at `http://localhost:8000`

## API Endpoints

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00",
  "service": "agri-advisor-api"
}
```

### POST /chat
Main chat endpoint for asking questions.

**Request:**
```json
{
  "question": "How do I plant teff?",
  "k": 3,
  "translate_local": false
}
```

**Response:**
```json
{
  "answer": "Based on agricultural research...",
  "backend": "mock-rag",
  "sources": [
    {
      "text": "Teff (Eragrostis tef) is a staple crop...",
      "metadata": {
        "crop": "teff",
        "topic": "planting",
        "source": "Ethiopian Agriculture Manual"
      }
    }
  ],
  "question_id": "uuid-here"
}
```

### POST /feedback
Submit feedback for a question.

**Request:**
```json
{
  "question_id": "uuid-here",
  "rating": 5,
  "comment": "Very helpful!"
}
```

**Response:**
```json
{
  "message": "Feedback received",
  "question_id": "uuid-here"
}
```

## Services

- **RAG Service**: retrieval from provided datas
- **Translation Service**: Ge'ez script detection and translation (googletrans)
- **Logging Service**: Structured JSONL logging
- **Cache Service**: In-memory cache for repeated queries

## Logs

Logs are written to the `logs/` directory:
- `query_log.jsonl`: All queries and responses
- `feedback_log.jsonl`: User feedback
- `error_log.jsonl`: Error logs

## Development

The backend uses:
- FastAPI for async endpoints
- Pydantic for request/response validation
- In-memory cache (TTL: 1 hour)
- Structured JSONL logging

## Notes

- Translation requires `googletrans` (may need internet connection)

