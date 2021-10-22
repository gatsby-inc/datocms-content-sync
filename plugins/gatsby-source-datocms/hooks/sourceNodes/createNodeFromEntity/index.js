"use strict";

var buildItemTypeNode = require('./itemType');

var buildFieldNode = require('./field');

var buildUploadNode = require('./upload');

var buildItemNode = require('./item');

var buildSiteNode = require('./site');

var BUILDERS = {
  item_type: buildItemTypeNode,
  field: buildFieldNode,
  upload: buildUploadNode,
  item: buildItemNode,
  site: buildSiteNode
};

var datocmsCreateNodeManifest = function datocmsCreateNodeManifest(_ref) {
  var _node$entityPayload, _node$entityPayload$m;

  var node = _ref.node,
      context = _ref.context;

  if (node !== null && node !== void 0 && (_node$entityPayload = node.entityPayload) !== null && _node$entityPayload !== void 0 && (_node$entityPayload$m = _node$entityPayload.meta) !== null && _node$entityPayload$m !== void 0 && _node$entityPayload$m.updated_at && node !== null && node !== void 0 && node.locale //   Date.now() - new Date(node.entityPayload.meta.updated_at).getTime() <=
  //     // milliseconds
  //     1000 *
  //       // seconds
  //       60 *
  //       // minutes
  //       60 *
  //       // hours
  //       48
  ) {
    var unstable_createNodeManifest = context.actions.unstable_createNodeManifest;
    var createNodeManifestIsSupported = typeof unstable_createNodeManifest === "function";
    var shouldCreateNodeManifest = createNodeManifestIsSupported && context.previewMode;

    if (true) {
      var _node$entityPayload2;

      // Example manifestId: "34324203-2021-07-08T21:52:28.791+01:00"
      // Example node.id: "DatoCmsPost-1233566-en"
      var manifestId = "".concat(node === null || node === void 0 ? void 0 : (_node$entityPayload2 = node.entityPayload) === null || _node$entityPayload2 === void 0 ? void 0 : _node$entityPayload2.id, "-").concat(node.entityPayload.meta.updated_at);
      console.info("DatoCMS: Creating node manifest with id ".concat(manifestId));
      unstable_createNodeManifest({
        manifestId: manifestId,
        node: node
      });
    } else if (context.previewMode && !createNodeManifestIsSupported) {
      console.warn("DatoCMS: Your version of Gatsby core doesn't support Content Sync (via the unstable_createNodeManifest action). Please upgrade to the latest version to use Content Sync in your site.");
    }
  }
};

module.exports = function (entity, context) {
  if (!BUILDERS[entity.type]) {
    console.log("Don't know how to build entity of type '".concat(entity.type, "'!"));
    return;
  }

  var result = BUILDERS[entity.type](entity, context);
  var nodesToCreate = Array.isArray(result) ? result : [result];
  nodesToCreate.map(function (node) {
    context.actions.createNode(node);
    datocmsCreateNodeManifest({
      node: node,
      context: context
    });
  });
};