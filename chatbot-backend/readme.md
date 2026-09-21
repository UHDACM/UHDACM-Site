# Chatbot Backend  

This is the backend for the chatbot application. Follow the steps below to set up and run the project.  

## Installation  

1. Clone the repository to your local machine.  
2. Navigate to the project directory.  
3. Install the required dependencies:  

  ```bash  
  npm install  
  ```  

## Environment Variables
```
Set the following environment variables in a `.env` file in the project root:

```env
GOOGLE_API_KEYS=<key>,<key2>,...
AI_MODEL=gemma-3-27b-it

##### CHROMA #####
# local
CHROMA_IS_CLOUD=false
CHROMA_DB_HOST=localhost
CHROMA_DB_PORT=5477
CHROMA_DB_COLLECTION_NAME=primary
PORT=4000

# cloud (only if chroma cloud is set to true)
CHROMA_API_KEY=<get-ur-own-api-key>
CHROMA_TENANT=<get-ur-own-tenant>
CHROMA_DATABASE_NAME=<get-ur-own-db>



# if logging enabled, will use betterstack logger.
ENABLE_LOGGER=false
COLLECTOR_SOURCE_SECRET=<secret>
COLLECTOR_INGESTING_HOST=<https-host>


# if auth_cookie required, it will prevent requests to chat without auth cookie
AUTH_COOKIE_REQUIRED=false,
AUTH_COOKIE_JWT_SECRET=<insert_secret>
AUTH_COOKIE_TURNSTILE_SECRET=<insert_cloudflare_turnstile_secret>


```

- `GOOGLE_API_KEYS`: Comma-separated list of Google API keys.
- `CHROMA_DB_HOST`: Hostname for the Chroma database.
- `CHROMA_DB_PORT`: Port number for the Chroma database.
- `CHROMA_DB_COLLECTION_NAME`: Name of the Chroma collection to use.
- `PORT`: Port for the backend server.
```

## Running the Chroma Server  

Start the Chroma server by running the following command:  

```bash  
npm run chroma-server  
```  

> NOTE: for local testing, only one instance of the chroma-server is necessary
> 
> If `vector-context-manager`'s chromaDB server is running already, you don't need to run this one.
>
> Ensure the port for chromaDB is the same as `vector-context-manager`'s port.
> 
> Unexpected behavior will occur otherwise.
> 
> If you're connecting to a cloud instance, ensure the env is set properly.

## Running the Ingester  

To add context to the chatbot, run the ingester with the `input.txt` file:  

```bash  
npm run ingestTest  
```  

## Running the Server  

Finally, start the backend server:  

```bash  
npm run dev  
```

Your chatbot backend should now be up and running!

## Evals

The agent has a scored regression suite in [`src/_eval`](./src/_eval/readme.md).
Each case runs one **full agent invocation** down the same path production takes
(`processQuery` → agent → `search` tool → vector DB) and grades what the agent
actually *did* — which query it searched, what the vector DB returned, and the
answer, links, and quick replies it produced.

```bash
nvm use 22            # node 18 will not build this project
npm run eval          # full suite, ~6 min
npm run eval:fast     # deterministic checks only — seconds, no LLM judge calls
npm run eval:probe    # what the vector DB returns for each case; no LLM calls, free
npm run eval:view     # open the web report
```

Three things to know before running it:

- **It reads the live vector DB.** Nothing is ever written, but CMS edits can
  drift the corpus away from what the cases assume. `npm run eval:probe` tells
  you whether a failure is the agent regressing or the corpus moving — start
  there, it costs nothing.
- **The LLM judge is capped per day.** A full run is ~91 judge calls. Runs abort
  early with a clear message when the quota is gone; `eval:fast` never touches it.
- **A red result is not automatically a bug in the agent.** It can equally be a
  stale case or an ambiguously worded rubric.

**See [`src/_eval/readme.md`](./src/_eval/readme.md)** for how cases are written,
how the `present`/`absent` pairs work, the judge quota, and how to calibrate
after a CMS change.

## Hosting

Self-hosted on **Railway**, alongside the CMS. The service is stateless - all
durable state is in Chroma Cloud - so the container is disposable and needs no
volume.

### Railway service settings
Unlike `cms/`, **Root Directory must stay at the repo root.** This service's
`tsconfig.json` sets `rootDir: "../"` and includes `../shared/src`, so `shared/`
is compiled into this service's own `dist/` and has to be in the build context.
Pointing Root Directory at `chatbot-backend` makes every `@shared/*` import
unresolvable.

    Root Directory   /                            (leave at the repo root)
    Dockerfile Path  chatbot-backend/Dockerfile
    Watch Paths      /chatbot-backend/**, /shared/**
    Healthcheck      /health_check
    Replicas         1

**Replicas must stay at 1.** The rate limiter is a process-local object in
`src/index.ts`; a second replica would multiply every published limit, since
neither instance sees the other's counters.

Because `rootDir` is `../`, the compiled entrypoint lands at
`dist/chatbot-backend/src/index.js` - that nesting is why `npm start` is
`node ./dist/chatbot-backend/src`, and why the Dockerfile copies the whole
`dist/` (it also contains `dist/shared/src`).

### Production env vars
Same as the local list above, with these differences:

    NODE_ENV=production      # REQUIRED: gates the auth cookie's
                             # secure + sameSite=none attributes. Without it the
                             # browser drops the cookie on cross-origin requests
                             # and every /chat call 401s.

    # Do NOT set PORT. Railway injects it, and the app reads process.env.PORT.

    # Comma-separated; apex and www both need to be listed or one of them gets
    # a CORS failure. This is the browser-facing origin allowlist.
    FRONTEND_ADDRESS=https://uhdacm.org,https://www.uhdacm.org

    EVAL_MODE=false          # leave false/unset in production

`env_vars` throws at module load when a required variable is missing, so a
misconfiguration shows up as an immediate boot crash in the Railway deploy log
rather than a half-working service.

Chroma stays on **Chroma Cloud** (`CHROMA_IS_CLOUD=true`); there is no Chroma
service on Railway. `vector-context-manager` writes the collection this service
reads, so both must point at the same tenant/database/collection, and both must
keep `chromadb` and `@chroma-core/default-embed` on matching versions - a
different default embedding model on either side silently breaks retrieval.

### After changing the deployment URL
`NEXT_PUBLIC_CHATBOT_ENDPOINT` in `site/` is inlined at **build** time, so
changing it in Vercel requires a site redeploy, not just an env edit.
