# Quick Start Guide (Remote ML via ngrok)

## Prerequisites

- Python 3.8+ (for backend)
- Node.js 16+ and npm (for frontend)

## 1) Configure Backend Environment

Edit `backend/.env` and set the remote ML base URL (NO `/ask` at the end):

```env
RAG_REMOTE_URL="https://your-ngrok-subdomain.ngrok-free.dev"
export REMOTE_ONLY="true"
# (optional)
#export REMOTE_TIMEOUT_SECONDS=15
export CORS_ORIGINS="http://localhost:3000"
```

For your current setup this should be:

```env
RAG_REMOTE_URL="https://rhizophagous-angeline-semisolemnly.ngrok-free.dev"
export REMOTE_ONLY="true"
export CORS_ORIGINS="http://localhost:3000"
```

Notes:
- The backend will automatically call `<RAG_REMOTE_URL>/ask`.
- Do not set `RAG_MOCK=true` if you want to use the remote ML.

## 2) Start the Backend

From the project root, run:

```bash
pip3 install -r backend/requirements.txt
bash ./start-backend.sh
```

Alternatively (manual):

```bash
cd backend
pip3 install -r requirements.txt
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000

## 3) Verify Backend → Remote ML

Health check:

```bash
curl http://localhost:8000/health
```

Expected: JSON with `"ml_online": true` and `"remote_url"` set to your ngrok domain.

Remote preview (calls your remote `/ask`):

```bash
curl -X POST "http://localhost:8000/debug/remote_preview?question=What%20is%20the%20best%20season%20to%20plant%20teff%20in%20Ethiopia?&k=3"
```

Expected: `{ "ok": true, "raw": { "answer": "...", "sources": [...] } }`

## 4) Start the Frontend

In a new terminal:

```bash
cd frontend
npm install
npm start
```

The app will open at http://localhost:3000

## 5) Test End-to-End

- Open http://localhost:3000
- Ask: "What is the best season to plant teff in Ethiopia?"
- You should receive a grounded answer with sources returned by the remote ML.

## Example API Calls

```bash
# Health
curl http://localhost:8000/health

# Chat (backend will call remote /ask)
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "How do I plant teff?", "k": 3, "translate_local": false}'

# Feedback
curl -X POST http://localhost:8000/feedback \
  -H "Content-Type: application/json" \
  -d '{"question_id": "your-question-id", "rating": 5, "comment": "Very helpful!"}'
```

## Troubleshooting

- If `ml_online` is false:
  - Ensure `RAG_REMOTE_URL` has NO trailing `/ask`
  - Ensure the ngrok endpoint is reachable and your remote ML `/ask` accepts POSTs with JSON `{ question, k, translate_local }`
- If CORS issues occur:
  - Confirm `export CORS_ORIGINS="http://localhost:3000"` in `backend/.env`
- If answers look generic:
  - Verify the remote ML returns grounded `sources` and that the backend logs show successful remote calls via `/debug/remote_preview`.

## Notes

- The backend includes two debug endpoints:
  - `POST /debug/remote_preview` — preview raw remote response
  - `POST /debug/flush_queue` — flushes queued requests if remote was offline
- When your ngrok URL changes, update `backend/.env` and restart the backend.