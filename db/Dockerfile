FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node database.json ./
COPY --chown=node:node migrations ./migrations

USER node

CMD ["./node_modules/.bin/db-migrate", "up", "--env", "dev"]
