FROM oven/bun:canary AS builder

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build \
    && rm -rf node_modules \
    && bun install --frozen-lockfile --production

FROM oven/bun:canary-slim AS runner

LABEL org.opencontainers.image.title="@oliverperzyk/discord-community" \
    org.opencontainers.image.description="A Discord application for my Discord community." \
    org.opencontainers.image.version="0.0.1" \
    org.opencontainers.image.authors="oliverperzyk (Oliwier Perzyński) <olek@oliverperzyk.com>" \
    org.opencontainers.image.licenses="MIT" \
    org.opencontainers.image.url="https://oliverperzyk.com/discord-server" \
    org.opencontainers.image.source="https://github.com/oliverperzyk/discord-community"

WORKDIR /opt/app
ENV NODE_ENV=production \
    HOME=/opt/app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock

RUN groupadd --gid 1001 app \
    && useradd --uid 1001 --gid app --no-create-home --shell /usr/sbin/nologin app \
    && chown -R app:app /opt/app

USER app
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD bun -e "process.exit(0)"
CMD ["bun", "run", "start"]
