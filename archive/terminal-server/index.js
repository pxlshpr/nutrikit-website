import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { Client } from 'ssh2';
import { readFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { validateControllerToken } from './auth.js';

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
const MAX_HISTORY_BYTES = parseInt(process.env.MAX_HISTORY_BYTES || '1048576', 10); // 1MB default

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

// =============================================================================
// Session State (single shared session)
// =============================================================================

const session = {
  controller: null,        // WebSocket of authenticated controller
  viewers: new Set(),      // Set of viewer WebSockets
  sshConnection: null,     // SSH2 client
  shellStream: null,       // SSH shell stream
  outputBuffer: '',        // Rolling buffer for history
  cols: 120,
  rows: 30,
  active: false,
  taskIdentifier: null,    // Current task being worked on
};

// Helper to append to output buffer (with size limit)
function appendToBuffer(data) {
  session.outputBuffer += data;
  if (session.outputBuffer.length > MAX_HISTORY_BYTES) {
    // Keep the last MAX_HISTORY_BYTES of data
    session.outputBuffer = session.outputBuffer.slice(-MAX_HISTORY_BYTES);
  }
}

// Broadcast to all connected clients (controller + viewers)
function broadcast(message) {
  const messageStr = typeof message === 'string' ? message : JSON.stringify(message);

  if (session.controller?.readyState === 1) {
    try {
      session.controller.send(messageStr);
    } catch (e) {
      console.error('Failed to send to controller:', e.message);
    }
  }

  for (const viewer of session.viewers) {
    if (viewer.readyState === 1) {
      try {
        viewer.send(messageStr);
      } catch (e) {
        console.error('Failed to send to viewer:', e.message);
      }
    }
  }
}

// Send session info to all clients
function broadcastSessionInfo() {
  broadcast({
    type: 'session-info',
    hasController: session.controller !== null,
    viewerCount: session.viewers.size,
    active: session.active,
    taskIdentifier: session.taskIdentifier,
  });
}

// Send to a single client
function sendTo(ws, message) {
  if (ws.readyState === 1) {
    try {
      ws.send(typeof message === 'string' ? message : JSON.stringify(message));
    } catch (e) {
      console.error('Failed to send message:', e.message);
    }
  }
}

// =============================================================================
// SSH Session Management
// =============================================================================

function createSSHSession() {
  if (session.sshConnection) {
    console.log('SSH session already exists');
    return;
  }

  console.log('Creating new SSH session...');
  session.sshConnection = new Client();

  session.sshConnection.on('ready', () => {
    console.log('SSH connection established');
    broadcast({ type: 'status', status: 'connected', message: 'SSH connection established' });

    session.sshConnection.shell(
      {
        term: 'xterm-256color',
        cols: session.cols,
        rows: session.rows,
        env: {
          LANG: 'en_US.UTF-8',
          LC_ALL: 'en_US.UTF-8',
        }
      },
      (err, stream) => {
        if (err) {
          console.error('Failed to create shell:', err.message);
          broadcast({ type: 'status', status: 'error', message: `Failed to create shell: ${err.message}` });
          destroySSHSession();
          return;
        }

        session.shellStream = stream;
        session.active = true;
        broadcastSessionInfo();

        // Pipe SSH output to all clients
        stream.on('data', (data) => {
          const output = data.toString('utf-8');
          appendToBuffer(output);
          broadcast({ type: 'output', data: output });
        });

        stream.stderr.on('data', (data) => {
          const output = data.toString('utf-8');
          appendToBuffer(output);
          broadcast({ type: 'output', data: output });
        });

        stream.on('close', () => {
          console.log('Shell stream closed');
          broadcast({ type: 'status', status: 'disconnected', message: 'Shell closed' });
          destroySSHSession();
        });
      }
    );
  });

  session.sshConnection.on('error', (err) => {
    console.error('SSH connection error:', err.message);
    broadcast({ type: 'status', status: 'error', message: `SSH error: ${err.message}` });
    destroySSHSession();
  });

  session.sshConnection.on('close', () => {
    console.log('SSH connection closed');
    broadcast({ type: 'status', status: 'disconnected', message: 'SSH connection closed' });
    destroySSHSession();
  });

  // Connect
  broadcast({ type: 'status', status: 'connecting', message: `Connecting to ${SSH_HOST}...` });

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
    broadcast({ type: 'status', status: 'error', message: 'No authentication method configured' });
    return;
  }

  session.sshConnection.connect(connectionConfig);
}

function destroySSHSession() {
  session.active = false;

  if (session.shellStream) {
    try {
      session.shellStream.close();
    } catch (e) {
      // Ignore
    }
    session.shellStream = null;
  }

  if (session.sshConnection) {
    try {
      session.sshConnection.end();
    } catch (e) {
      // Ignore
    }
    session.sshConnection = null;
  }

  // Clear buffer when session ends
  session.outputBuffer = '';
  session.taskIdentifier = null;

  broadcastSessionInfo();
}

// =============================================================================
// WebSocket Connection Handling
// =============================================================================

wss.on('connection', (ws, req) => {
  const connectionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  console.log(`[${connectionId}] New WebSocket connection from ${req.socket.remoteAddress}`);

  let mode = null; // 'controller' or 'viewer'
  let handshakeComplete = false;

  // Wait for connect handshake
  const handshakeTimeout = setTimeout(() => {
    if (!handshakeComplete) {
      console.log(`[${connectionId}] Handshake timeout`);
      sendTo(ws, { type: 'error', code: 'HANDSHAKE_TIMEOUT', message: 'Connection timeout - no handshake received' });
      ws.close();
    }
  }, 5000);

  ws.on('message', async (message) => {
    try {
      const msg = JSON.parse(message.toString());

      // Handle handshake
      if (!handshakeComplete) {
        if (msg.type !== 'connect') {
          sendTo(ws, { type: 'error', code: 'INVALID_HANDSHAKE', message: 'First message must be connect handshake' });
          ws.close();
          return;
        }

        clearTimeout(handshakeTimeout);
        handshakeComplete = true;

        if (msg.mode === 'controller') {
          // Validate controller token
          const isValid = await validateControllerToken(msg.token);

          if (!isValid) {
            console.log(`[${connectionId}] Controller auth failed, downgrading to viewer`);
            sendTo(ws, { type: 'error', code: 'AUTH_FAILED', message: 'Not authorized to control terminal' });
            // Downgrade to viewer
            mode = 'viewer';
            session.viewers.add(ws);
          } else if (session.controller) {
            // Already have a controller
            console.log(`[${connectionId}] Controller slot taken, assigning as viewer`);
            sendTo(ws, { type: 'error', code: 'CONTROLLER_EXISTS', message: 'Another controller is already connected' });
            mode = 'viewer';
            session.viewers.add(ws);
          } else {
            console.log(`[${connectionId}] Assigned as controller`);
            mode = 'controller';
            session.controller = ws;

            // Store task identifier if provided
            if (msg.taskIdentifier) {
              session.taskIdentifier = msg.taskIdentifier;
            }

            // Create SSH session if not exists
            if (!session.sshConnection) {
              createSSHSession();
            }
          }
        } else {
          // Viewer mode
          console.log(`[${connectionId}] Assigned as viewer`);
          mode = 'viewer';
          session.viewers.add(ws);
        }

        // Send connection confirmation
        sendTo(ws, { type: 'connected', mode });

        // Send history to late joiners
        if (session.outputBuffer) {
          sendTo(ws, { type: 'history', data: session.outputBuffer });
        }

        // Send current session info
        sendTo(ws, {
          type: 'session-info',
          hasController: session.controller !== null,
          viewerCount: session.viewers.size,
          active: session.active,
          taskIdentifier: session.taskIdentifier,
        });

        // Notify others of viewer count change
        broadcastSessionInfo();
        return;
      }

      // Handle regular messages (post-handshake)
      switch (msg.type) {
        case 'input':
          // Only controller can send input
          if (mode === 'controller' && session.shellStream && msg.data) {
            session.shellStream.write(msg.data);
          }
          break;

        case 'resize':
          // Only controller can resize
          if (mode === 'controller' && session.shellStream && msg.cols && msg.rows) {
            session.cols = msg.cols;
            session.rows = msg.rows;
            session.shellStream.setWindow(msg.rows, msg.cols, 0, 0);
          }
          break;

        case 'ping':
          sendTo(ws, { type: 'pong' });
          break;

        case 'set-task':
          // Controller can update current task
          if (mode === 'controller' && msg.taskIdentifier) {
            session.taskIdentifier = msg.taskIdentifier;
            broadcastSessionInfo();
          }
          break;

        default:
          console.log(`[${connectionId}] Unknown message type:`, msg.type);
      }
    } catch (e) {
      console.error(`[${connectionId}] Failed to parse message:`, e.message);
    }
  });

  ws.on('close', () => {
    console.log(`[${connectionId}] WebSocket closed (mode: ${mode})`);
    clearTimeout(handshakeTimeout);

    if (mode === 'controller') {
      session.controller = null;
      // Notify viewers that controller left
      broadcast({ type: 'controller-left' });
      broadcastSessionInfo();

      // Optionally destroy SSH session when controller leaves
      // Uncomment if you want session to end when controller disconnects:
      // destroySSHSession();
    } else if (mode === 'viewer') {
      session.viewers.delete(ws);
      broadcastSessionInfo();
    }
  });

  ws.on('error', (err) => {
    console.error(`[${connectionId}] WebSocket error:`, err.message);
  });
});

// =============================================================================
// HTTP Endpoints
// =============================================================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', ssh_host: SSH_HOST });
});

// Session info endpoint
app.get('/session', (req, res) => {
  res.json({
    active: session.active,
    hasController: session.controller !== null,
    viewerCount: session.viewers.size,
    taskIdentifier: session.taskIdentifier,
    historySize: session.outputBuffer.length,
  });
});

// =============================================================================
// Graceful Shutdown
// =============================================================================

process.on('SIGTERM', () => {
  console.log('Shutting down...');

  destroySSHSession();

  // Close all viewer connections
  for (const viewer of session.viewers) {
    try {
      viewer.close();
    } catch (e) {
      // Ignore
    }
  }

  if (session.controller) {
    try {
      session.controller.close();
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

// =============================================================================
// Start Server
// =============================================================================

server.listen(PORT, BIND_ADDRESS, () => {
  console.log(`Terminal server listening on ${BIND_ADDRESS}:${PORT}`);
  console.log(`SSH target: ${SSH_USERNAME}@${SSH_HOST}:${SSH_PORT}`);
  console.log(`Max history buffer: ${MAX_HISTORY_BYTES} bytes`);
});
