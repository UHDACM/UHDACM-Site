# Strapi 5 image for Railway.
#
# The build context is this directory. Set "Root Directory" = cms in the Railway
# service settings; nothing outside cms/ is referenced, so the rest of the
# monorepo is neither copied nor needed.
#
# Debian slim rather than Alpine on purpose: sharp (image thumbnailing) and
# better-sqlite3 both ship prebuilt binaries for glibc, and musl sends them down
# a from-source compile that is slow and occasionally breaks.

FROM node:22-slim AS build

# Only needed when a native module has no matching prebuilt binary.
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# NODE_ENV=production here so the admin panel is built minified.
RUN NODE_ENV=production npm run build


FROM node:22-slim AS runtime

# Strapi runs unprivileged; node:22-slim already ships a `node` user.
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0

COPY --from=build --chown=node:node /app /app

# --chown above covers the copied contents, but /app itself was created by
# WORKDIR and is still root-owned. Strapi writes .tmp/ (and public/uploads when
# the local provider is active) directly inside /app, so it needs the directory
# itself to be writable or it dies on boot with EACCES.
RUN chown node:node /app

USER node
EXPOSE 1337
CMD ["npm", "run", "start"]
