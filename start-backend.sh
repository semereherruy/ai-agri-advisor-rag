#!/usr/bin/env bash
# Start the backend FastAPI app from project root.
# Usage: ./start-backend.sh

set -euo pipefail

# Export variables from .env if present
if [ -f .env ]; then
  # load root .env
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

# Also allow a backend-local .env to override or provide RAG_REMOTE_URL
if [ -f backend/.env ]; then
  echo "Loading backend/.env"
  set -a
  # shellcheck disable=SC1091
  . backend/.env
  set +a
fi

#!/usr/bin/env bash
# start-backend.sh — robust uvicorn starter (safe for foreground or background)

set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

ENV_FILE="$ROOT_DIR/backend/.env"
PIDFILE="$ROOT_DIR/backend/.backend.pid"
LOGFILE="${BACKEND_LOG:-$ROOT_DIR/backend_start.log}"

# load env if exists
if [ -f "$ENV_FILE" ]; then
  # export variables to this shell
  set -a
  . "$ENV_FILE"
  set +a
fi

# kill stale pid if present and not running
if [ -f "$PIDFILE" ]; then
  OLD_PID=$(cat "$PIDFILE" 2>/dev/null || true)
  if [ -n "$OLD_PID" ] && ps -p "$OLD_PID" > /dev/null 2>&1; then
    echo "Backend already running with pid $OLD_PID"
    exit 0
  else
    rm -f "$PIDFILE" || true
  fi
fi

# decide whether to run reload (dev) or not (nohup/background)
if [ "${NOHUP:-}" = "1" ] || [ "${NOHUP:-}" = "true" ]; then
  echo "Running without --reload because NOHUP is set"
  EXTRA_ARGS=""
else
  echo "Running with --reload (dev mode)"
  EXTRA_ARGS="--reload"
fi

UVICORN_MODULE="backend.app.main:app"
HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-8000}"

# Start server (foreground). If caller wants background, use nohup or & explicitly.
echo "Starting backend (uvicorn) on http://${HOST}:${PORT} — using RAG_REMOTE_URL='${RAG_REMOTE_URL:-<not-set>}'"
uvicorn "$UVICORN_MODULE" --host "$HOST" --port "$PORT" $EXTRA_ARGS &
SERVER_PID=$!
# write pidfile
echo "$SERVER_PID" > "$PIDFILE"
echo "Started server pid=$SERVER_PID (pidfile=$PIDFILE). Logs: $LOGFILE"
wait $SERVER_PID
