"use strict";

var _excluded = ["cache", "loadStateFromCache"];

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('datocms-client'),
    SiteClient = _require.SiteClient,
    Loader = _require.Loader;

var CLIENT_HEADERS = {
  'X-Reason': 'dump',
  'X-SSG': 'gatsby'
};
var loaders = {};

function getLoader(_x) {
  return _getLoader.apply(this, arguments);
}

function _getLoader() {
  _getLoader = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
    var cache, loadStateFromCache, options, apiToken, apiUrl, environment, logApiCalls, pageSize, previewMode, clientOptions, loaderArgs, key, loader;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            cache = _ref.cache, loadStateFromCache = _ref.loadStateFromCache, options = _objectWithoutProperties(_ref, _excluded);
            apiToken = options.apiToken, apiUrl = options.apiUrl, environment = options.environment, logApiCalls = options.logApiCalls, pageSize = options.pageSize, previewMode = options.previewMode;
            clientOptions = {
              headers: CLIENT_HEADERS
            };

            if (options.environment) {
              clientOptions.environment = environment;
            }

            if (options.baseUrl) {
              clientOptions.baseUrl = apiUrl;
            }

            if (options.logApiCalls) {
              clientOptions.logApiCalls = logApiCalls;
            }

            loaderArgs = [[apiToken, clientOptions], previewMode, environment, {
              pageSize: pageSize
            }];
            key = JSON.stringify(loaderArgs);

            if (!loaders[key]) {
              _context.next = 10;
              break;
            }

            return _context.abrupt("return", loaders[key]);

          case 10:
            loader = _construct(Loader, loaderArgs);

            if (!loadStateFromCache) {
              _context.next = 14;
              break;
            }

            _context.next = 14;
            return loader.loadStateFromCache(cache);

          case 14:
            loaders[key] = loader;
            return _context.abrupt("return", loader);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getLoader.apply(this, arguments);
}

var nodeManifestWarningWasLogged;

var datocmsCreateNodeManifest = function datocmsCreateNodeManifest(_ref2) {
  var node = _ref2.node,
      context = _ref2.context;

  try {
    var _node$entityPayload, _node$entityPayload$m;

    var unstable_createNodeManifest = context.actions.unstable_createNodeManifest;
    var createNodeManifestIsSupported = typeof unstable_createNodeManifest === "function";
    var updatedAt = node === null || node === void 0 ? void 0 : (_node$entityPayload = node.entityPayload) === null || _node$entityPayload === void 0 ? void 0 : (_node$entityPayload$m = _node$entityPayload.meta) === null || _node$entityPayload$m === void 0 ? void 0 : _node$entityPayload$m.updated_at;
    var nodeNeedsManifestCreated = updatedAt && (node === null || node === void 0 ? void 0 : node.locale);
    var shouldCreateNodeManifest = createNodeManifestIsSupported && nodeNeedsManifestCreated;

    if (shouldCreateNodeManifest) {
      // Example manifestId: "34324203-2021-07-08T21:52:28.791+01:00"
      var manifestId = "".concat(node.entityPayload.id, "-").concat(updatedAt);
      unstable_createNodeManifest({
        manifestId: manifestId,
        node: node,
        updatedAt: updatedAt
      });
    } else if (!createNodeManifestIsSupported && !nodeManifestWarningWasLogged) {
      console.warn("DatoCMS: Your version of Gatsby core doesn't support Content Sync (via the unstable_createNodeManifest action). Please upgrade to the latest version to use Content Sync in your site.");
      nodeManifestWarningWasLogged = true;
    }
  } catch (e) {
    console.info("Cannot create node manifest", e.message);
  }
};

module.exports = {
  getLoader: getLoader,
  datocmsCreateNodeManifest: datocmsCreateNodeManifest
};