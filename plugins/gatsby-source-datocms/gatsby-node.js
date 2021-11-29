"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require('core-js/stable');

require('regenerator-runtime/runtime');

var _require = require('./errorMap'),
    ERROR_MAP = _require.ERROR_MAP;

var withForcedPreviewMode = function withForcedPreviewMode(hook) {
  return function (context, options) {
    return hook(context, _objectSpread({}, options, {
      previewMode: process.env.GATSBY_CLOUD && process.env.gatsby_executing_command === 'develop' || process.env.GATSBY_IS_PREVIEW === "true" || options.previewMode
    }));
  };
};

var createSchemaCustomization = require('./hooks/createSchemaCustomization');

exports.createSchemaCustomization = withForcedPreviewMode(createSchemaCustomization);

var sourceNodes = require('./hooks/sourceNodes');

exports.sourceNodes = withForcedPreviewMode(sourceNodes);
var onPluginInitSupported = false;

try {
  var _require2 = require("gatsby-plugin-utils"),
      isGatsbyNodeLifecycleSupported = _require2.isGatsbyNodeLifecycleSupported;

  if (isGatsbyNodeLifecycleSupported("onPluginInit")) {
    onPluginInitSupported = 'stable';
  } else if (isGatsbyNodeLifecycleSupported("unstable_onPluginInit")) {
    onPluginInitSupported = 'unstable';
  }
} catch (e) {
  console.error("Could not check if Gatsby supports onPluginInit lifecycle");
}

var onPluginInit = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
    var reporter;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            reporter = _ref.reporter;
            reporter.setErrorMap(ERROR_MAP);

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function onPluginInit(_x) {
    return _ref2.apply(this, arguments);
  };
}();

if (onPluginInitSupported === 'stable') {
  // to properly initialize plugin in worker (`onPreBootstrap` won't run in workers)
  // need to conditionally export otherwise it throw an error for older versions
  exports.onPluginInit = onPluginInit;
} else if (onPluginInitSupported === 'unstable') {
  exports.unstable_onPluginInit = onPluginInit;
}

exports.onPreInit = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref3) {
    var reporter;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            reporter = _ref3.reporter;

            // onPluginInit replaces onPreInit in Gatsby V4
            // old versions of Gatsby does not have the method setErrorMap
            if (!onPluginInitSupported && reporter.setErrorMap) {
              reporter.setErrorMap(ERROR_MAP);
            }

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x2) {
    return _ref4.apply(this, arguments);
  };
}();