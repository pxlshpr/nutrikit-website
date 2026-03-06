# NutriKit Terminal Server

WebSocket terminal server that provides SSH access to your Mac via Tailscale for the NutriKit task pages.

## Prerequisites

1. **Tailscale** installed and connected on both machines
2. **SSH enabled** on your Mac (System Settings > General > Sharing > Remote Login)
3. **SSH key** set up for authentication (recommended)

## Setup

### 1. Find your Mac's Tailscale IP

```bash
tailscale ip -4
```

### 2. Set up SSH key authentication (if not already done)

```bash
# Generate a key (if you don't have one)
ssh-keygen -t ed25519 -C "nutrikit-terminal"

# Copy to your Mac (replace IP with your Tailscale IP)
ssh-copy-id -i ~/.ssh/id_ed25519.pub your_username@100.x.x.x
```

### 3. Configure the server

```bash
cp .env.example .env
```

Edit `.env` with your values:
- `SSH_HOST`: Your Mac's Tailscale IP
- `SSH_USERNAME`: Your Mac username
- `SSH_PRIVATE_KEY_PATH`: Path to your SSH private key

### 4. Install dependencies

```bash
npm install
```

### 5. Run the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will start on `http://localhost:3001`.

## Usage

The terminal server accepts WebSocket connections with optional query parameters:

- `command`: Initial command to run after connecting
- `dir`: Initial directory to change to

Example WebSocket URL:
```
ws://localhost:3001?dir=~/Developer/NutriKit&command=claude%20--dangerously-skip-permissions
```

## Message Protocol

### Client → Server

```json
{ "type": "input", "data": "ls -la\r" }
{ "type": "resize", "cols": 80, "rows": 24 }
{ "type": "ping" }
```

### Server → Client

```json
{ "type": "output", "data": "..." }
{ "type": "status", "status": "connected", "message": "SSH connection established" }
{ "type": "pong" }
```

## Security Notes

- By default, the server only binds to `127.0.0.1` (localhost)
- For remote access, set `BIND_ADDRESS` to your Tailscale IP
- SSH key authentication is strongly recommended over password auth
- The server should only be accessible over Tailscale or localhost
