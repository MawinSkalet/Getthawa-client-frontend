FROM node:24-bookworm-slim AS production-deps

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
COPY vendor ./vendor

RUN npm ci --omit=dev

FROM node:24-bookworm-slim AS builder

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
COPY vendor ./vendor

RUN npm ci

COPY . .

RUN npm run lint -- --max-warnings=0

ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN rm -rf .next
RUN npm run build

FROM node:24-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "start"]
