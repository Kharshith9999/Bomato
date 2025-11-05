FROM node:18-alpine

WORKDIR /workspace

# Install dependencies
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN cd backend && npm ci
RUN cd frontend && npm ci

# Copy source code
COPY . .

# Setup scripts
RUN echo '#!/bin/bash\nnpm run setup-all' > /usr/local/bin/setup && chmod +x /usr/local/bin/setup

CMD ["sleep", "infinity"]