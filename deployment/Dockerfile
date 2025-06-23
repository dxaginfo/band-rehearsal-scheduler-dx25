# Build stage for client
FROM node:16 AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Build stage for server
FROM node:16 AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./

# Final stage
FROM node:16-slim
WORKDIR /app

# Copy built client
COPY --from=client-build /app/client/build /app/client/build

# Copy server files
COPY --from=server-build /app/server /app/server

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Set working directory to server
WORKDIR /app/server

# Start server
CMD ["node", "src/server.js"]