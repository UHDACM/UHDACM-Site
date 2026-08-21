export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // Railway terminates TLS ahead of us. Without `url` + `proxy`, Strapi builds
  // links from the internal host/scheme, which breaks admin redirects and the
  // absolute URLs it hands to webhook consumers.
  url: env('PUBLIC_URL', undefined),
  proxy: env.bool('IS_PROXIED', false),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
