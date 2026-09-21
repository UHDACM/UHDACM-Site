# chatbot-backend image for Railway.
#
# The build context is the REPO ROOT, not this directory - unlike cms/, which
# references nothing outside itself. This service's tsconfig sets
# rootDir "../" and include ["../shared/src", "./src"], so shared/ is compiled
# into this service's own dist and must be present at build time.
#
# Railway service settings:
#   Root Directory  = /                        (leave at the repo root)
#   Dockerfile Path = chatbot-backend/Dockerfile
#   Watch Paths     = /chatbot-backend/**, /shared/**
# Setting Root Directory to chatbot-backend cannot work: shared/ would not be
# in the context and tsc would fail to resolve every @shared/* import.
#
# Debian slim rather than Alpine, matching cms/Dockerfile: the onnxruntime
# binary behind @chroma-core/default-embed ships prebuilt for glibc, and musl
# sends it down a from-source compile that is slow and occasionally breaks.

FROM node:22-slim AS build

WORKDIR /app

# Dependency manifests first so these layers survive source-only changes.
COPY chatbot-backend/package.json chatbot-backend/package-lock.json ./chatbot-backend/
COPY shared/package.json shared/package-lock.json ./shared/

WORKDIR /app/chatbot-backend
RUN npm ci

# shared/ needs its own install purely so tsc can resolve the BlocksContent
# type from @strapi/blocks-react-renderer (shared/src/types/cms/CMSTypes.ts).
# That import is type-only and is elided from the emitted .js, so this package
# is deliberately absent from the runtime stage.
WORKDIR /app/shared
RUN npm ci

WORKDIR /app
COPY shared/ ./shared/
COPY chatbot-backend/ ./chatbot-backend/

WORKDIR /app/chatbot-backend
# build:ci, not build: the latter re-runs `npm i` and `cd ../shared && npm i`,
# which the two steps above already did from the lockfiles.
RUN npm run build:ci


FROM node:22-slim AS runtime

WORKDIR /app/chatbot-backend

# Not cosmetic here: src/index.ts gates the auth cookie's secure/sameSite="none"
# attributes on NODE_ENV === "production", and the site calls this API
# cross-origin. Without it the cookie is dropped by the browser.
ENV NODE_ENV=production

# Own the tree before installing, not after: a recursive chown over an
# already-populated node_modules costs ~50s, while chowning the empty dirs is
# instant and npm then writes everything as node itself.
RUN chown -R node:node /app
USER node

COPY --chown=node:node chatbot-backend/package.json chatbot-backend/package-lock.json ./
RUN npm ci --omit=dev

# rootDir "../" makes tsc emit dist/chatbot-backend/src + dist/shared/src, which
# is why package.json's start script is `node ./dist/chatbot-backend/src`.
COPY --from=build --chown=node:node /app/chatbot-backend/dist ./dist

EXPOSE 4000
CMD ["npm", "run", "start"]
