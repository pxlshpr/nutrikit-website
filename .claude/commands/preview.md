Deploy the NutriKit website to a persistent HTTPS preview server accessible via Tailscale.

## Configuration

- **Source**: `/Users/pxlshpr/Developer/nutrikit-website`
- **Build output**: `out/` (Next.js static export)
- **Serve directory**: `~/.ota/NutriKit-Website/site/` (persistent)
- **OTA Host**: Determined dynamically — use `scutil --get LocalHostName` to get the machine name (e.g. `pxlhome`), then the host is `<hostname>.tailcfcb6b.ts.net`
- **Port**: `8449`
- **TLS Cert**: `~/.ota/certs/ota-cert.pem` (shared with OTA servers)
- **LaunchAgent**: `com.pxlshpr.ota.nutrikit-website`

## Instructions

### 1. Determine host

```bash
OTA_HOST="$(scutil --get LocalHostName | tr '[:upper:]' '[:lower:]').tailcfcb6b.ts.net"
```

### 2. Build the site

```bash
cd /Users/pxlshpr/Developer/nutrikit-website && npm run build
```

If the build fails, show the errors and stop.

### 3. Deploy to persistent directory

Sync the built static files to the persistent serve directory:

```bash
rsync -a --delete /Users/pxlshpr/Developer/nutrikit-website/out/ ~/.ota/NutriKit-Website/site/
```

### 4. Ensure TLS certs exist

```bash
mkdir -p ~/.ota/certs
if [ ! -f ~/.ota/certs/ota-cert.pem ] || [ ! -f ~/.ota/certs/ota-key.pem ]; then
    /Applications/Tailscale.app/Contents/MacOS/Tailscale cert \
        --cert-file ~/.ota/certs/ota-cert.pem \
        --key-file ~/.ota/certs/ota-key.pem \
        "$OTA_HOST"
fi
```

### 5. Ensure HTTPS server is running

The server is managed by a LaunchAgent (`com.pxlshpr.ota.nutrikit-website`) that auto-starts on login and survives reboots. Verify it's running:

```bash
lsof -i :8449 -sTCP:LISTEN
```

If NOT running, load and kick it:

```bash
launchctl bootout gui/$(id -u)/com.pxlshpr.ota.nutrikit-website 2>/dev/null || true
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.pxlshpr.ota.nutrikit-website.plist
```

If it IS running, restart it to pick up new files:

```bash
launchctl kickstart -k gui/$(id -u)/com.pxlshpr.ota.nutrikit-website
```

### 6. Tell the user

Report the deploy, then present the URL as a clickable markdown link:

```
[NutriKit Website Preview](https://OTA_HOST:8449)
```

Replace `OTA_HOST` with the actual value. This URL is persistent and bookmarkable.

## Important
- Always build fresh before syncing
- The server serves static files from `~/.ota/NutriKit-Website/site/` — NOT from the project directory
- Port 8449 is dedicated to this website preview
