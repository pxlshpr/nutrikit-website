#!/bin/bash
# Setup Linear <-> NutriKit auto-sync
# This script sets up everything needed for automatic syncing

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEBSITE_DIR="$(dirname "$SCRIPT_DIR")"
PLIST_NAME="com.nutrikit.auto-pull"
PLIST_SOURCE="$SCRIPT_DIR/$PLIST_NAME.plist"
PLIST_DEST="$HOME/Library/LaunchAgents/$PLIST_NAME.plist"

echo "🚀 Setting up Linear <-> NutriKit Auto-Sync"
echo "================================================"
echo ""

# Step 1: Make auto-pull script executable
echo "📜 Making auto-pull script executable..."
chmod +x "$SCRIPT_DIR/auto-pull-nutrikit.sh"
echo "   ✅ Done"
echo ""

# Step 2: Create LaunchAgents directory if needed
echo "📁 Setting up LaunchAgents directory..."
mkdir -p "$HOME/Library/LaunchAgents"
echo "   ✅ Done"
echo ""

# Step 3: Unload existing service if present
if launchctl list | grep -q "$PLIST_NAME"; then
    echo "🔄 Unloading existing service..."
    launchctl unload "$PLIST_DEST" 2>/dev/null || true
    echo "   ✅ Done"
    echo ""
fi

# Step 4: Copy and load the launchd plist
echo "📋 Installing launchd service..."
cp "$PLIST_SOURCE" "$PLIST_DEST"
launchctl load "$PLIST_DEST"
echo "   ✅ Service installed and running"
echo ""

# Step 5: Verify the service is running
echo "🔍 Verifying service status..."
if launchctl list | grep -q "$PLIST_NAME"; then
    echo "   ✅ Service is active"
else
    echo "   ❌ Service failed to start"
    exit 1
fi
echo ""

# Step 6: Create log directory
echo "📝 Setting up logging..."
mkdir -p "$HOME/Library/Logs"
echo "   Log file: ~/Library/Logs/nutrikit-auto-pull.log"
echo ""

echo "================================================"
echo "✅ Local auto-pull service is now running!"
echo ""
echo "The service will:"
echo "  - Pull NutriKit repo from GitHub every 30 seconds"
echo "  - Keep ~/Developer/NutriKit in sync with remote"
echo ""
echo "To check logs:"
echo "  tail -f ~/Library/Logs/nutrikit-auto-pull.log"
echo ""
echo "To stop the service:"
echo "  launchctl unload ~/Library/LaunchAgents/$PLIST_NAME.plist"
echo ""
echo "================================================"
echo ""
echo "Next step: Set up the Linear webhook"
echo ""
echo "Run: npm run setup-webhook"
echo ""
echo "This will configure Linear to send webhooks to your deployed site."
echo ""
