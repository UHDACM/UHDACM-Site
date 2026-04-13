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