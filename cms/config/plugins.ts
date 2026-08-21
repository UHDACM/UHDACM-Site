export default ({ env }) => {
  // Media lives on Cloudflare R2 in every deployed environment. When the R2 vars
  // are absent we fall through to Strapi's built-in local provider, so a fresh
  // clone still boots for local dev without any bucket credentials.
  const bucket = env('R2_BUCKET');
  if (!bucket) {
    return {};
  }

  return {
    upload: {
      config: {
        provider: 'aws-s3',
        providerOptions: {
          // `baseUrl` is the value written into the `files` table's url column
          // (and into every formats[*].url). It therefore has to be a domain we
          // control, not the R2 endpoint - getting this wrong is what leaves
          // media pointing at a host we can lose.
          baseUrl: env('CDN_URL'),
          s3Options: {
            credentials: {
              accessKeyId: env('R2_ACCESS_KEY_ID'),
              secretAccessKey: env('R2_ACCESS_SECRET'),
            },
            region: 'auto',
            endpoint: env('R2_ENDPOINT'),
            forcePathStyle: true,
            params: {
              Bucket: bucket,
              // No ACL here on purpose: R2 rejects ACL headers, and public
              // access is granted by the bucket's custom-domain binding instead.
            },
          },
        },
        actionOptions: {
          upload: {},
          uploadStream: {},
          delete: {},
        },
      },
    },
  };
};
