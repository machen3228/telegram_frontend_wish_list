FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_BACKEND_URL=https://telegram-wish-list-machen.amvera.io
RUN npm run build
