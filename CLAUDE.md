# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a headless Chromium server using patchright-core (Playwright fork). The server provides a WebSocket endpoint for remote browser automation, designed to run in containerized environments.

## Architecture

- **Single-file Node.js application**: `server/index.mjs` contains the entire server implementation
- **Containerized deployment**: Multi-stage Docker build with runtime optimization
- **Environment-based configuration**: All settings controlled via environment variables
- **WebSocket server**: Provides remote browser access at configurable endpoint

## Key Components

- **Browser Configuration (`getBrowserConfig`)**: Handles environment variable parsing for port, WebSocket path, timeout, browser arguments, and proxy settings
- **Server Launcher (`launch`)**: Initializes Chromium headless server with configured options
- **Signal Handling**: Graceful shutdown on SIGINT/SIGTERM

## Development Commands

```bash
# Install dependencies (from server/ directory)
cd server && npm install

# Install Chromium browser
npx patchright-core install chromium-headless-shell

# Run the server locally
node index.mjs

# Build and run local docker image
docker build -t patchright-headless-server .
docker run -p 5678:5678 patchright-headless-server

# Run from Docker Hub
docker run -p 5678:5678 synacktra/patchright-headless-server
```

## Environment Configuration

Server behavior is controlled entirely through environment variables:
- `BROWSER_PORT`: Server port (default: 5678)
- `BROWSER_WS_PATH`: WebSocket path (default: /patchright)
- `BROWSER_TIMEOUT`: Connection timeout in milliseconds
- `BROWSER_ARGS`: Space-separated browser arguments
- `BROWSER_PROXY_SERVER`: Proxy server URL
- `BROWSER_PROXY_BYPASS`: Proxy bypass patterns
- `BROWSER_PROXY_USERNAME`: Proxy authentication username
- `BROWSER_PROXY_PASSWORD`: Proxy authentication password

## Docker Architecture

Two-stage build process:
1. **Builder stage**: Installs dependencies and Chromium browser
2. **Runtime stage**: Copies artifacts and installs runtime dependencies only

The server exposes port 5678 and runs `node index.mjs` as the entry point.