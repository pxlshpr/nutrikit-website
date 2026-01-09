import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { Client } from 'ssh2';
import { readFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Config
const PORT = process.env.PORT || 3001;
const BIND_ADDRESS = process.env.BIND_ADDRESS || '127.0.0.1';
const SSH_HOST = process.env.SSH_HOST;
const SSH_PORT = parseInt(process.env.SSH_PORT || '22', 10);
const SSH_USERNAME = process.env.SSH_USERNAME;
const SSH_PRIVATE_KEY_PATH = process.env.SSH_PRIVATE_KEY_PATH?.replace('~', homedir());
const SSH_PASSWORD = process.env.SSH_PASSWORD;

// Validate config
if (!SSH_HOST || !SSH_USERNAME) {
  console.error('ERROR: SSH_HOST and SSH_USERNAME are required');
  process.exit(1);
}

// Read private key if path is provided
let privateKey = null;
if (SSH_PRIVATE_KEY_PATH) {
  const keyPath = SSH_PRIVATE_KEY_PATH.startsWith('/')
    ? SSH_PRIVATE_KEY_PATH
    : join(homedir(), SSH_PRIVATE_KEY_PATH);

  if (existsSync(keyPath)) {
    privateKey = readFileSync(keyPath);
    console.log(`Loaded SSH key from: ${keyPath}`);
  } else {
    console.warn(`SSH key not found at: ${keyPath}`);
  }
}

// CORS middleware for Express routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', ssh_host: SSH_HOST });
});

// Track active connections
const connections = new Map();

wss.on('connection', (ws, req) => {
  const connectionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  console.log(`[${connectionId}] New WebSocket connection from ${req.socket.remoteAddress}`);

  // Parse initial command from URL query
  const url = new URL(req.url, `http://${req.headers.host}`);
  const initialCommand = url.searchParams.get('command');
  const initialDir = url.searchParams.get('dir') || '~';

  let sshConnection = null;
  let shellStream = null;
  let currentCols = 120;
  let currentRows = 30;

  // Send status to client
  const sendStatus = (status, message = '') => {
    try {
      ws.send(JSON.stringify({ type: 'status', status, message }));
    } catch (e) {
      console.error(`[${connectionId}] Failed to send status:`, e.message);
    }
  };

  // Send output to client
  const sendOutput = (data) => {
    try {
      ws.send(JSON.stringify({ type: 'output', data }));
    } catch (e) {
      console.error(`[${connectionId}] Failed to send output:`, e.message);
    }
  };

  // Create SSH connection
  sshConnection = new Client();

  sshConnection.on('ready', () => {
    console.log(`[${connectionId}] SSH connection established`);
    sendStatus('connected', 'SSH connection established');

    // Create shell with PTY
    sshConnection.shell(
      {
        term: 'xterm-256color',
        cols: currentCols,
        rows: currentRows,
        env: {
          LANG: 'en_US.UTF-8',
          LC_ALL: 'en_US.UTF-8',
        }
      },
      (err, stream) => {
        if (err) {
          console.error(`[${connectionId}] Failed to create shell:`, err.message);
          sendStatus('error', `Failed to create shell: ${err.message}`);
          ws.close();
          return;
        }

        shellStream = stream;
        connections.set(connectionId, { ws, sshConnection, shellStream });

        // Pipe SSH output to WebSocket
        stream.on('data', (data) => {
          sendOutput(data.toString('utf-8'));
        });

        stream.stderr.on('data', (data) => {
          sendOutput(data.toString('utf-8'));
        });

        stream.on('close', () => {
          console.log(`[${connectionId}] Shell stream closed`);
          sendStatus('disconnected', 'Shell closed');
          cleanup();
        });

        // Note: Directory change and commands are now handled by the frontend
        // to allow for proper sequencing with Claude's prompts
      }
    );
  });

  sshConnection.on('error', (err) => {
    console.error(`[${connectionId}] SSH connection error:`, err.message);
    sendStatus('error', `SSH error: ${err.message}`);
    cleanup();
  });

  sshConnection.on('close', () => {
    console.log(`[${connectionId}] SSH connection closed`);
    sendStatus('disconnected', 'SSH connection closed');
    cleanup();
  });

  // Handle WebSocket messages
  ws.on('message', (message) => {
    try {
      const msg = JSON.parse(message.toString());

      switch (msg.type) {
        case 'input':
          if (shellStream && msg.data) {
            shellStream.write(msg.data);
          }
          break;

        case 'resize':
          if (shellStream && msg.cols && msg.rows) {
            currentCols = msg.cols;
            currentRows = msg.rows;
            shellStream.setWindow(msg.rows, msg.cols, 0, 0);
          }
          break;

        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }));
          break;

        default:
          console.log(`[${connectionId}] Unknown message type:`, msg.type);
      }
    } catch (e) {
      console.error(`[${connectionId}] Failed to parse message:`, e.message);
    }
  });

  ws.on('close', () => {
    console.log(`[${connectionId}] WebSocket closed`);
    cleanup();
  });

  ws.on('error', (err) => {
    console.error(`[${connectionId}] WebSocket error:`, err.message);
    cleanup();
  });

  // Cleanup function
  const cleanup = () => {
    connections.delete(connectionId);

    if (shellStream) {
      try {
        shellStream.close();
      } catch (e) {
        // Ignore
      }
      shellStream = null;
    }

    if (sshConnection) {
      try {
        sshConnection.end();
      } catch (e) {
        // Ignore
      }
      sshConnection = null;
    }

    if (ws.readyState === ws.OPEN) {
      ws.close();
    }
  };

  // Connect to SSH server
  sendStatus('connecting', `Connecting to ${SSH_HOST}...`);

  const connectionConfig = {
    host: SSH_HOST,
    port: SSH_PORT,
    username: SSH_USERNAME,
    readyTimeout: 10000,
    keepaliveInterval: 30000,
    keepaliveCountMax: 3,
  };

  if (privateKey) {
    connectionConfig.privateKey = privateKey;
  } else if (SSH_PASSWORD) {
    connectionConfig.password = SSH_PASSWORD;
  } else {
    sendStatus('error', 'No authentication method configured (need SSH key or password)');
    ws.close();
    return;
  }

  sshConnection.connect(connectionConfig);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down...');

  // Close all connections
  for (const [id, conn] of connections) {
    try {
      conn.shellStream?.close();
      conn.sshConnection?.end();
      conn.ws?.close();
    } catch (e) {
      // Ignore
    }
  }

  wss.close(() => {
    server.close(() => {
      process.exit(0);
    });
  });
});

// Start server
server.listen(PORT, BIND_ADDRESS, () => {
  console.log(`Terminal server listening on ${BIND_ADDRESS}:${PORT}`);
  console.log(`SSH target: ${SSH_USERNAME}@${SSH_HOST}:${SSH_PORT}`);
});
