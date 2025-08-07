FROM node:20-slim AS builder

WORKDIR /build

# Copy package files
COPY server/package.json ./

# Install Node.js dependencies
RUN npm install

# Install Chromium via patchright
RUN npx patchright-core install chromium-headless-shell


FROM node:20-slim AS runtime

WORKDIR /server

# Copy Node.js dependencies and Chromium
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /root/.cache/ms-playwright /root/.cache/ms-playwright

# Install runtime dependencies for Chromium
RUN npx patchright-core install-deps chromium-headless-shell

# Copy application code
COPY server/ .

# Expose port
EXPOSE 5678

# Run the browser service
CMD ["node", "index.mjs"]