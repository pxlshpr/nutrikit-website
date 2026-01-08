#!/bin/bash
# Auto-pull NutriKit repository to keep local copy in sync with GitHub
# This script is run by launchd every 30 seconds

NUTRIKIT_PATH="${HOME}/Developer/NutriKit"
LOG_FILE="${HOME}/Library/Logs/nutrikit-auto-pull.log"

# Create log directory if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Navigate to repo
cd "$NUTRIKIT_PATH" || {
    log "ERROR: Cannot cd to $NUTRIKIT_PATH"
    exit 1
}

# Check if there are local changes
if [[ -n $(git status --porcelain) ]]; then
    log "WARNING: Local changes detected, skipping pull"
    exit 0
fi

# Fetch and check for updates
git fetch origin main --quiet 2>/dev/null

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    log "Pulling updates from GitHub..."
    if git pull --quiet origin main 2>/dev/null; then
        log "SUCCESS: Pulled latest changes"
    else
        log "ERROR: Pull failed"
    fi
else
    # Only log occasionally to avoid spamming
    if [ $(($(date +%s) % 300)) -lt 30 ]; then
        log "INFO: Already up to date"
    fi
fi

# Keep log file from growing too large (keep last 1000 lines)
if [ -f "$LOG_FILE" ]; then
    tail -n 1000 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
fi
