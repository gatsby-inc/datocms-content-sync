const buildItemTypeNode = require('./itemType');
const buildFieldNode = require('./field');
const buildUploadNode = require('./upload');
const buildItemNode = require('./item');
const buildSiteNode = require('./site');

const BUILDERS = {
  item_type: buildItemTypeNode,
  field: buildFieldNode,
  upload: buildUploadNode,
  item: buildItemNode,
  site: buildSiteNode,
};

const datocmsCreateNodeManifest = ({ node, context }) => {
  if (
    node?.entityPayload?.meta?.updated_at &&
    node?.locale
    //   Date.now() - new Date(node.entityPayload.meta.updated_at).getTime() <=
    //     // milliseconds
    //     1000 *
    //       // seconds
    //       60 *
    //       // minutes
    //       60 *
    //       // hours
    //       48
  ) {
    const { unstable_createNodeManifest } = context.actions;
    const createNodeManifestIsSupported =
      typeof unstable_createNodeManifest === `function`;

    const shouldCreateNodeManifest =
      createNodeManifestIsSupported && context.previewMode;

    if (true) {
      // Example manifestId: "34324203-2021-07-08T21:52:28.791+01:00"
      // Example node.id: "DatoCmsPost-1233566-en"

      const manifestId = `${node?.entityPayload?.id}-${node.entityPayload.meta.updated_at}`;

      console.info(`DatoCMS: Creating node manifest with id ${manifestId}`);

      unstable_createNodeManifest({
        manifestId,
        node,
      });
    } else if (context.previewMode && !createNodeManifestIsSupported) {
      console.warn(
        `DatoCMS: Your version of Gatsby core doesn't support Content Sync (via the unstable_createNodeManifest action). Please upgrade to the latest version to use Content Sync in your site.`,
      );
    }
  }
};

module.exports = (entity, context) => {
  if (!BUILDERS[entity.type]) {
    console.log(`Don't know how to build entity of type '${entity.type}'!`);
    return;
  }

  const result = BUILDERS[entity.type](entity, context);
  const nodesToCreate = Array.isArray(result) ? result : [result];

  nodesToCreate.map(node => {
    context.actions.createNode(node);
    datocmsCreateNodeManifest({
      node,
      context,
    });
  });
};
