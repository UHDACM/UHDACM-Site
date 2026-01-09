# UHD ACM HeadlessCMS (Powered by Strapi)
Strapi allows UHD ACM to do dynamic content updates via a headless CMS, enabling seamless site management without altering the frontend code.

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

# Database (SQLite default)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

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
