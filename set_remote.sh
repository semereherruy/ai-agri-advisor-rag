#!/usr/bin/env bash
# set_remote.sh — write RAG_REMOTE_URL to backend/.env and restart backend
set -euo pipefail
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <RAG_REMOTE_URL>"
  exit 2
fi
REMOTE="$1"
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$ROOT_DIR/backend/.env"
PIDFILE="$ROOT_DIR/backend/.backend.pid"

echo "RAG_REMOTE_URL=$REMOTE" > "$ENV_FILE"

# restart backend if running
if [ -f "$PIDFILE" ]; then
  OLD_PID=$(cat "$PIDFILE" 2>/dev/null || true)
  if [ -n "$OLD_PID" ] && ps -p "$OLD_PID" > /dev/null 2>&1; then
    echo "Stopping backend pid $OLD_PID"
    kill -9 "$OLD_PID" || true
    sleep 0.5
    rm -f "$PIDFILE" || true
  fi
fi

# start backend in stable background mode
NOHUP=1 "$ROOT_DIR"/start-backend.sh &> "$ROOT_DIR/backend_start.log" &
echo "Started backend with NOHUP=1; logs: $ROOT_DIR/backend_start.log"
