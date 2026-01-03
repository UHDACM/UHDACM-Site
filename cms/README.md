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

---
### `develop`
Starts the app with autoReload for development.  
```bash
npm run develop # or yarn develop
```

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
