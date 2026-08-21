// Origins allowed to call the API from a browser. Server-to-server callers (the
// Next.js server components and both webhook consumers) are unaffected by CORS.
const DEFAULT_CORS_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5500',
  'https://uhdacm.org',
  'https://www.uhdacm.org',
  'https://test.uhdacm.org',
];

export default ({ env }) => {
  // Host only, no scheme - CSP directives take bare hosts.
  const cdnHost = env('CDN_HOST', '');
  const mediaSources = ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', ...(cdnHost ? [cdnHost] : [])];

  return [
    'strapi::logger',
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'connect-src': ["'self'", 'https:'],
            // The CDN host must be listed or the admin Media Library shows
            // broken thumbnails. API responses are unaffected either way, which
            // makes this easy to miss until an editor opens the panel.
            'img-src': mediaSources,
            'media-src': mediaSources,
            upgradeInsecureRequests: null,
          },
        },
      },
    },
    {
      name: 'strapi::cors',
      config: {
        origin: env.array('CORS_ORIGINS', DEFAULT_CORS_ORIGINS),
      },
    },
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};
