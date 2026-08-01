# Stage 1: Build React + Vite App
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci || npm install

# Copy source files
COPY . .

# Build arguments for environment variables
ARG VITE_OPENWEATHER_API_KEY
ARG VITE_API_BASE_URL
ENV VITE_OPENWEATHER_API_KEY=$VITE_OPENWEATHER_API_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build static production bundle
RUN npm run build

# Stage 2: Serve using Lightweight Nginx Web Server
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static built assets from builder stage
COPY --from=builder /app/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
