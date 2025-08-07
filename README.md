# Patchright Headless Server

A containerized headless Chromium server powered by [patchright](https://github.com/Kaliiiiiiiiii-Vinyzu/patchright). This server provides a WebSocket endpoint for remote browser automation, perfect for testing, scraping, and automation tasks in containerized environments.

## Quick Start

### Docker (Recommended)

```bash
# Pull and run from Docker Hub
docker run -p 5678:5678 synacktra/patchright-headless-server

# The server will be available at ws://localhost:5678/patchright
```

### Local Development

```bash
# Clone and setup
git clone https://github.com/synacktraa/patchright-headless-server.git
cd patchright-headless-server/server
npm install

# Install Chromium browser
npx patchright-core install chromium-headless-shell

# Run the server
node index.mjs
```

## Usage

Once the server is running, connect to the WebSocket endpoint:

- **Default endpoint**: `ws://localhost:5678/patchright`
- **Health check**: The server logs the WebSocket endpoint URL on startup

Example with Playwright/Patchright client:

```javascript
import { chromium } from 'playwright-core'; // or 'patchright-core'

const browser = await chromium.connect('ws://localhost:5678/patchright');
const page = await browser.newPage();
await page.goto('https://example.com');
// ... your automation code
await browser.close();
```

## Configuration

Configure the server behavior using environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `BROWSER_PORT` | `5678` | Server port |
| `BROWSER_WS_PATH` | `/patchright` | WebSocket endpoint path |
| `BROWSER_TIMEOUT` | - | Connection timeout (milliseconds) |
| `BROWSER_ARGS` | See defaults* | Space-separated browser arguments |
| `BROWSER_PROXY_SERVER` | - | Proxy server URL |
| `BROWSER_PROXY_BYPASS` | - | Proxy bypass patterns |
| `BROWSER_PROXY_USERNAME` | - | Proxy authentication username |
| `BROWSER_PROXY_PASSWORD` | - | Proxy authentication password |

*Default browser arguments: `--no-sandbox --disable-dev-shm-usage --disable-gpu --disable-web-security --disable-features=VizDisplayCompositor`

### Example with Custom Configuration

```bash
docker run -p 8080:8080 \
  -e BROWSER_PORT=8080 \
  -e BROWSER_WS_PATH=/browser \
  -e BROWSER_TIMEOUT=30000 \
  synacktra/patchright-headless-server
```

## Docker Build

Build your own image:

```bash
docker build -t patchright-headless-server .
docker run -p 5678:5678 patchright-headless-server
```

## License

MIT License - see [LICENSE](LICENSE) file for details.
