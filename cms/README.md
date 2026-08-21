# UHD ACM HeadlessCMS (Powered by Strapi)
Strapi allows UHD ACM to do dynamic content updates via a headless CMS, enabling seamless site management without altering the frontend code.

*Notes on how to obtain API key is available below*

## How CMS is connected with frontend
The CMS integrates with the frontend located in the `./site` directory through a webhook (`/api/CMSUpdate`). Content is fetched via HTTP GET requests, which include:
- URL parameters to specify the requested content.
- An authorization header for secure access.

This architecture ensures efficient and secure content updates, making site management easier than ever.

## Scripts Overview
**prereqs**<br/>
Before running any scripts, ensure that the Strapi CLI is installed globally. You can install it using the following command:

```bash
npm install -g strapi
```

You'll need the following env vars to run the strapi correctly
```env
# Server
HOST=0.0.0.0
PORT=1337
APP_KEYS=yourAppKey1,yourAppKey2,yourAppKey3,yourAppKey4
API_TOKEN_SALT=yourApiTokenSalt
ADMIN_JWT_SECRET=yourAdminJwtSecret
TRANSFER_TOKEN_SALT=yourTransferTokenSalt

ENCRYPTION_KEY=yourEncryptionKey
JWT_SECRET=yourJwtSecret

# Database (SQLite for local dev)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

Media uploads go to the local `public/uploads` folder unless `R2_BUCKET` is set,
so the vars in the Hosting section below are optional for local development.

---
### `develop`
Starts the app with autoReload for development.  
```bash
npm run develop # or yarn develop
```

> Note: first time running it will require you to setup a "admin account".

Read strapi docs to learn more.

### `start`
Runs the app without autoReload for production.  
```bash
npm run start # or yarn start
```

### `build`
Compiles the admin panel for deployment.  
```bash
npm run build # or yarn build
```

## Obtaining API Key
Once Strapi is running, go to the admin portal and go to settings (gear icon, left side), then press API Tokens (below overview), and obtain the read only key.

If you cannot view the token, regenerate it, and save that key in your env.

It will allow the frontend (and other services) to request data from the strapiCMS.

## Registering webhooks
A webhook for the site and vector-context-manager are **required**.

Set them up by opening the strapi dashboard, then going to `settings > webhooks`.

Once there
- add a webhook for `url`
- add header `Authorization` == `cmsAuthToken` (remember this value)
- add the events `create`, `update`, and `delete`
<br/>

ENSURE SITE and VECTOR-CONTEXT-MANAGER has the `CMS_AUTH_TOKEN` and `CMS_URL` environment variables set. They will respond 403 if the header value does not match.

 `http://localhost:3000/api/CMSUpdate` (site url), and . 

Do the same thing for `http://localhost:5500/update` (vector db manager).



## Hosting

The CMS is self-hosted on **Railway** (it used to be on Strapi Cloud, whose free
plan was deleted on 2026-09-01). Media lives in a **Cloudflare R2** bucket served
from `cdn.uhdacm.org`, which is deliberately separate from the app host: the
Strapi container is disposable, and moving it again does not mean moving 200+ MB
of photos again.

### Railway service settings
- **Root Directory** must be `cms` - the repo is a monorepo and the build uses
  `cms/Dockerfile`. Nothing outside `cms/` is referenced.
- Postgres comes from the Railway Postgres plugin; point `DATABASE_URL` at its
  reference variable and set `DATABASE_CLIENT=postgres`.

### Production env vars
On top of the local vars above:

```env
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}

PUBLIC_URL=https://<railway-domain>   # Strapi builds admin links from this
IS_PROXIED=true                       # Railway terminates TLS in front of us

# Cloudflare R2. Setting R2_BUCKET is what switches the upload provider from
# the local disk to R2 - without it Strapi silently uses local storage.
R2_BUCKET=uhdacm-media
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=...
R2_ACCESS_SECRET=...
CDN_URL=https://cdn.uhdacm.org        # written into every media url in the DB
CDN_HOST=cdn.uhdacm.org               # host only; added to the admin panel CSP

# Optional: overrides the default browser-origin allowlist in config/middlewares.ts
CORS_ORIGINS=https://uhdacm.org,https://www.uhdacm.org
```

`CDN_URL` is the important one. It becomes the `url` on every row of the `files`
table, so it must be a domain we control - if it ever points at someone else's
host, losing that host means losing every image reference.

### Things that do NOT survive a `strapi transfer`
Admin users, API tokens, and webhooks are all excluded. After any restore:
1. Recreate the first admin user, then invite the other officers.
2. Mint a new API token and update `STRAPI_API_TOKEN` (site) and `CMS_API_TOKEN`
   (vector-context-manager).
3. Re-register both webhooks - see "Registering webhooks" above.

### Backups
Railway Postgres has managed backups. Media is in R2 and is not part of them.
There is a standalone snapshot of the pre-migration Strapi Cloud state (843
media objects + all content as JSON) taken 2026-08-20, kept outside the repo.

## Migrating data between instances

`strapi transfer` has two problems in 5.22.0. Both are worked around below; read
this before trying the documented-looking command, which does not work.

**1. `--from` / `--to` are ignored and the CLI prompts anyway.** In
`cli/commands/transfer/command.js`, `determineDirection()` returns the parsed URL
object instead of the string `'from'`/`'to'`. The next line does
`opts[direction]`, indexes with a URL object, gets `undefined`, and falls through
to an interactive prompt - which also mislabels the direction. Work around it by
*also* passing the values as environment variables, which `determineUrl()` and
`determineToken()` check before prompting. The `--from`/`--to` flags still drive
the real transfer, so pass both:

```bash
STRAPI_TRANSFER_URL="$URL" STRAPI_TRANSFER_TOKEN="$TOKEN" \
  ./node_modules/.bin/strapi transfer --from "$URL" --from-token "$TOKEN" --force
```

Use `./node_modules/.bin/strapi`, not `npx strapi`, and redirect stdin from
`/dev/null` in scripts so a stray prompt fails loudly instead of hanging.

**2. The assets stage is not reliable and takes the whole transfer down with
it.** Migrating off Strapi Cloud, it stalled after 15s on the first 1.7 MB image
("transfer stalled, aborting"), closed the websocket, and rolled back the entire
transaction - including the entities that had already succeeded. This is a known
class of bug (strapi/strapi#25093, #16473, #20087).

Transfer content and media separately instead:

```bash
# 1. content only - the plugin::upload.file DB rows still come across,
#    --exclude files skips only the binaries
strapi transfer --from ... --exclude files --force

# 2. media straight into the bucket, keyed by filename. Strapi's filenames are
#    already content-hashed and flat, so they map 1:1 onto R2 object keys.
aws s3 sync ./media "s3://$R2_BUCKET/" --endpoint-url "$R2_ENDPOINT"

# 3. point the DB rows at the new host. Do this on the SOURCE instance before
#    pushing, so the destination never needs direct database access.
UPDATE files SET url = REPLACE(url, '<old-host>', '<new-host>'),
                 formats = REPLACE(formats, '<old-host>', '<new-host>'),
                 provider = 'aws-s3';
```

Media URLs live in three places per row: `url`, every `formats[*].url` (stored as
JSON text), and the `provider` column. `preview_url` and `provider_metadata` were
both null for every row here, but check before assuming that.

Verify afterwards that no URL still points at the old host - a transfer that
"succeeds" can still leave every image pointing somewhere that is about to be
switched off.

## Types
There are many types.

### Collection Types
- event
- gallery
- organization
- person
- qna

### Single Types
- featured-event
- leadership
- page-about
- page-contact
- page-events
- page-galleries
- page-home
- page-join
- page-media
- page-qnas
- site-info
