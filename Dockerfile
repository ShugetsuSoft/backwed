FROM oven/bun:1 as base

WORKDIR /usr/src/app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

USER bun
EXPOSE 3000/tcp
ENTRYPOINT ["backend"]