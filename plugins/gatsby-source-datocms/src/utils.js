const { SiteClient, Loader } = require('datocms-client');

const CLIENT_HEADERS = {
  'X-Reason': 'dump',
  'X-SSG': 'gatsby',
};

const GATSBY_CLOUD = process.env.GATSBY_CLOUD;
const GATSBY_EXECUTING_COMMAND = process.env.gatsby_executing_command;

const clients = {};
const loaders = {};

function getClient(options) {
  const { apiToken, apiUrl, environment } = options;
  const key = JSON.stringify({ apiToken, apiUrl, environment });

  if (clients[key]) {
    return clients[key];
  }

  const client = apiUrl
    ? new SiteClient(apiToken, { ...CLIENT_HEADERS, environment }, apiUrl)
    : new SiteClient(apiToken, { ...CLIENT_HEADERS, environment });

  clients[key] = client;

  return client;
}

function getLoader(options) {
  const { apiToken, apiUrl, previewMode, environment } = options;
  const key = JSON.stringify({ apiToken, apiUrl, previewMode, environment });

  if (loaders[key]) {
    return loaders[key];
  }

  const loader = new Loader(
    getClient({ apiToken, apiUrl, environment }),
    (GATSBY_CLOUD && GATSBY_EXECUTING_COMMAND === 'develop') || previewMode,
    environment,
  );

  loaders[key] = loader;

  return loader;
}

const FORTY_EIGHT_HOURS = 1000 * 60 * 60 * 48; // ms * sec * min * hr

const datocmsCreateNodeManifest = ({ node, context }) => {
  try {
    const { unstable_createNodeManifest } = context.actions;
    const createNodeManifestIsSupported =
      typeof unstable_createNodeManifest === `function`;

    const nodeNeedsManifestCreated =
      node?.entityPayload?.meta?.updated_at && node?.locale;

    const shouldCreateNodeManifest =
      createNodeManifestIsSupported && nodeNeedsManifestCreated;

    if (shouldCreateNodeManifest) {
      // Example manifestId: "34324203-2021-07-08T21:52:28.791+01:00"

      const nodeWasRecentlyUpdated =
        Date.now() - new Date(node.entityPayload.meta.updated_at).getTime() <=
        // Default to only create manifests for items updated in last 48 hours
        (process.env.CONTENT_SYNC_DATOCMS_HOURS_SINCE_ENTRY_UPDATE ||
          FORTY_EIGHT_HOURS);

      // We need to create manifests on cold builds, this prevents from creating many more
      // manifests than we actually need
      if (!nodeWasRecentlyUpdated) return;

      const manifestId = `${node?.entityPayload?.id}-${node.entityPayload.meta.updated_at}`;

      console.info(`DatoCMS: Creating node manifest with id ${manifestId}`);

      unstable_createNodeManifest({
        manifestId,
        node,
      });
    } else if (!createNodeManifestIsSupported) {
      console.warn(
        `DatoCMS: Your version of Gatsby core doesn't support Content Sync (via the unstable_createNodeManifest action). Please upgrade to the latest version to use Content Sync in your site.`,
      );
    }
  } catch (e) {
    console.info(`Cannot create node manifest`, e.message);
  }
};

module.exports = {
  getClient,
  getLoader,
  datocmsCreateNodeManifest,
};
