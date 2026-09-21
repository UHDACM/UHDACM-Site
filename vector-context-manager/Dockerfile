# vector-context-manager image for Railway.
#
# The build context is the REPO ROOT, not this directory - unlike cms/, which
# references nothing outside itself. This service's tsconfig sets
# rootDir "../" and include ["./", "../shared/src"], so shared/ is compiled
# into this service's own dist and must be present at build time.
#
# Railway service settings:
#   Root Directory  = /                               (leave at the repo root)
#   Dockerfile Path = vector-context-manager/Dockerfile
#   Watch Paths     = /vector-context-manager/**, /shared/**
# Setting Root Directory to vector-context-manager cannot work: shared/ would
# not be in the context and tsc would fail to resolve every @shared/* import.
#
# Keep replicas at 1. The writer's concurrency guard is an in-process `state`
# field (src/vectorDB/writer.ts), so a second replica would write the same
# Chroma collection concurrently.
#
# Debian slim rather than Alpine, matching cms/Dockerfile: the onnxruntime
# binary behind @chroma-core/default-embed ships prebuilt for glibc, and musl
# sends it down a from-source compile that is slow and occasionally breaks.

FROM node:22-slim AS build

WORKDIR /app

# Dependency manifests first so these layers survive source-only changes.
COPY vector-context-manager/package.json vector-context-manager/package-lock.json ./vector-context-manager/
COPY shared/package.json shared/package-lock.json ./shared/

WORKDIR /app/vector-context-manager
RUN npm ci

# shared/ needs its own install purely so tsc can resolve the BlocksContent
# type from @strapi/blocks-react-renderer (shared/src/types/cms/CMSTypes.ts).
# That import is type-only and is elided from the emitted .js, so this package
# is deliberately absent from the runtime stage.
WORKDIR /app/shared
RUN npm ci

WORKDIR /app
COPY shared/ ./shared/
COPY vector-context-manager/ ./vector-context-manager/

WORKDIR /app/vector-context-manager
# build:ci, not build: the latter re-runs `npm i` and `cd ../shared && npm i`,
# which the two steps above already did from the lockfiles. Its `rm -rf ./dist`
# is unnecessary here because the root .dockerignore keeps dist out of context.
RUN npm run build:ci


FROM node:22-slim AS runtime

WORKDIR /app/vector-context-manager
ENV NODE_ENV=production

# Own the tree before installing, not after: a recursive chown over an
# already-populated node_modules costs ~50s, while chowning the empty dirs is
# instant and npm then writes everything as node itself.
RUN chown -R node:node /app
USER node

COPY --chown=node:node vector-context-manager/package.json vector-context-manager/package-lock.json ./
RUN npm ci --omit=dev

# rootDir "../" makes tsc emit dist/vector-context-manager/src + dist/shared/src,
# which is why package.json's start script is
# `node ./dist/vector-context-manager/src`.
COPY --from=build --chown=node:node /app/vector-context-manager/dist ./dist

EXPOSE 5500
CMD ["npm", "run", "start"]
