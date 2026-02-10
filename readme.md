# 🌾 AI Agriculture Advisor (RAG-based MVP)

An AI-powered agriculture question-answering system focused on Teff and Maize, designed for Ethiopia → Africa → Global use. This project uses Retrieval-Augmented Generation (RAG) to answer farmers' questions based on trusted agricultural documents.

## 🚀 Quick Start

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip3 install -r requirements.txt
```

**Note:** Use `pip3` and `python3` (macOS default python is 2.7)

3. Run the FastAPI server:
```bash
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or use the helper script:
```bash
./start-backend.sh
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## 📋 Project Structure

```
agri-advisor-rag/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main FastAPI application
│   ├── services/           # Service modules
│   │   ├── rag_service.py  # Mock RAG service
│   │   ├── translation_service.py  # Translation with Ge'ez detection
│   │   ├── logging_service.py     # JSONL logging
│   │   └── cache_service.py       # In-memory cache
│   ├── requirements.txt    # Python dependencies
│   └── README.md          # Backend documentation
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   └── App.tsx       # Main app component
│   ├── package.json      # Node dependencies
│   └── README.md        # Frontend documentation
├── data/                 # Agricultural documents
├── logs/                 # Application logs (JSONL)
└── README.md            # This file
```

## 🎯 Features

### Backend
- **FastAPI** async endpoints
- **Mock RAG service** (drop-in replacement for real RAG)
- **Translation service** with Ge'ez script detection (Amharic/Tigrigna)
- **Structured logging** (JSONL format)
- **In-memory cache** for repeated queries
- **Request validation** with Pydantic

### Frontend
- **Mobile-first responsive design**
- **Smooth animations** (fade-in, slide, typing indicator)
- **Multi-language support** (English, Amharic, Tigrigna)
- **Source display** with collapsible panel
- **Feedback system** (thumbs up/down)
- **Error handling** with toast notifications

## 📡 API Endpoints

### POST /chat
Send a question and receive an answer with sources.

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
  "sources": [...],
  "question_id": "uuid"
}
```

### POST /feedback
Submit feedback for a question.

**Request:**
```json
{
  "question_id": "uuid",
  "rating": 5,
  "comment": "Very helpful!"
}
```

### GET /health
Health check endpoint.

## 🌍 Language Support

- **English** (default)
- **Amharic** - Automatic Ge'ez script detection → translate to English → RAG → translate back
- **Tigrigna** - Same translation flow as Amharic

## 🎨 Design System

- **Background**: `#F6FBF7` (soft off-white)
- **Assistant bubble**: `#E6F8ED` (light green)
- **User bubble**: `#2F9E44` (vivid green)
- **Accent**: `#60A664` (muted green)
- **Text**: `#0B2B17` (dark green/charcoal)

## 📝 Logging

All queries, responses, and feedback are logged to JSONL files in the `logs/` directory:
- `query_log.jsonl` - All queries and responses
- `feedback_log.jsonl` - User feedback
- `error_log.jsonl` - Error logs

## 🧪 Testing

See `demo-checklist.txt` for manual testing procedures.

## 📚 Documentation

- [Backend README](backend/README.md) - Backend API documentation
- [Frontend README](frontend/README.md) - Frontend component documentation

## ⚠️ Notes

- This is an MVP prototype, not a production system
- Translation requires internet connection (googletrans)
- Mock RAG service returns responses within ~500ms
- Cache TTL is set to 1 hour
- **macOS users:** Always use `python3` and `pip3` (not `python`/`pip`)

## 🔧 Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues and solutions.

## 🔮 Future Work

- Replace mock RAG with real RAG implementation
- Expand language support
- Add voice input/output
- Deploy to production

## 📜 Disclaimer

This system provides advisory information only. Farmers should consult local agricultural extension services for critical decisions.
