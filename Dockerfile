FROM node:24-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY utilities/ ./utilities/

EXPOSE 3000

# Stateless service — safe to run as the image's built-in non-root user.
USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health >/dev/null 2>&1 || exit 1

CMD ["node", "server.js"]
