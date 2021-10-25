"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('datocms-client'),
    SiteClient = _require.SiteClient,
    Loader = _require.Loader;

var CLIENT_HEADERS = {
  'X-Reason': 'dump',
  'X-SSG': 'gatsby'
};
var GATSBY_CLOUD = process.env.GATSBY_CLOUD;
var GATSBY_EXECUTING_COMMAND = process.env.gatsby_executing_command;
var clients = {};
var loaders = {};

function getClient(options) {
  var apiToken = options.apiToken,
      apiUrl = options.apiUrl,
      environment = options.environment;
  var key = JSON.stringify({
    apiToken: apiToken,
    apiUrl: apiUrl,
    environment: environment
  });

  if (clients[key]) {
    return clients[key];
  }

  var client = apiUrl ? new SiteClient(apiToken, _objectSpread({}, CLIENT_HEADERS, {
    environment: environment
  }), apiUrl) : new SiteClient(apiToken, _objectSpread({}, CLIENT_HEADERS, {
    environment: environment
  }));
  clients[key] = client;
  return client;
}

function getLoader(options) {
  var apiToken = options.apiToken,
      apiUrl = options.apiUrl,
      previewMode = options.previewMode,
      environment = options.environment;
  var key = JSON.stringify({
    apiToken: apiToken,
    apiUrl: apiUrl,
    previewMode: previewMode,
    environment: environment
  });

  if (loaders[key]) {
    return loaders[key];
  }

  var loader = new Loader(getClient({
    apiToken: apiToken,
    apiUrl: apiUrl,
    environment: environment
  }), GATSBY_CLOUD && GATSBY_EXECUTING_COMMAND === 'develop' || previewMode, environment);
  loaders[key] = loader;
  return loader;
}

var FORTY_EIGHT_HOURS = 1000 * 60 * 60 * 48; // ms * sec * min * hr

var datocmsCreateNodeManifest = function datocmsCreateNodeManifest(_ref) {
  var node = _ref.node,
      context = _ref.context;

  try {
    var _node$entityPayload, _node$entityPayload$m;

    var unstable_createNodeManifest = context.actions.unstable_createNodeManifest;
    var createNodeManifestIsSupported = typeof unstable_createNodeManifest === "function";
    var nodeNeedsManifestCreated = (node === null || node === void 0 ? void 0 : (_node$entityPayload = node.entityPayload) === null || _node$entityPayload === void 0 ? void 0 : (_node$entityPayload$m = _node$entityPayload.meta) === null || _node$entityPayload$m === void 0 ? void 0 : _node$entityPayload$m.updated_at) && (node === null || node === void 0 ? void 0 : node.locale);
    var shouldCreateNodeManifest = createNodeManifestIsSupported && nodeNeedsManifestCreated;

    if (shouldCreateNodeManifest) {
      var _node$entityPayload2;

      // Example manifestId: "34324203-2021-07-08T21:52:28.791+01:00"
      var nodeWasRecentlyUpdated = Date.now() - new Date(node.entityPayload.meta.updated_at).getTime() <= ( // Default to only create manifests for items updated in last 48 hours
      process.env.CONTENT_SYNC_DATOCMS_HOURS_SINCE_ENTRY_UPDATE || FORTY_EIGHT_HOURS); // We need to create manifests on cold builds, this prevents from creating many more
      // manifests than we actually need

      if (!nodeWasRecentlyUpdated) return;
      var manifestId = "".concat(node === null || node === void 0 ? void 0 : (_node$entityPayload2 = node.entityPayload) === null || _node$entityPayload2 === void 0 ? void 0 : _node$entityPayload2.id, "-").concat(node.entityPayload.meta.updated_at);
      console.info("DatoCMS: Creating node manifest with id ".concat(manifestId));
      unstable_createNodeManifest({
        manifestId: manifestId,
        node: node
      });
    } else if (!createNodeManifestIsSupported) {
      console.warn("DatoCMS: Your version of Gatsby core doesn't support Content Sync (via the unstable_createNodeManifest action). Please upgrade to the latest version to use Content Sync in your site.");
    }
  } catch (e) {
    console.info("Cannot create node manifest", e.message);
  }
};

module.exports = {
  getClient: getClient,
  getLoader: getLoader,
  datocmsCreateNodeManifest: datocmsCreateNodeManifest
};