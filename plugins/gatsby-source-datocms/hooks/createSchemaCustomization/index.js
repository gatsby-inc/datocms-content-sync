"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('humps'),
    pascalize = _require.pascalize;

var createTypes = require('../sourceNodes/createTypes');

var _require2 = require('../../errorMap'),
    prefixId = _require2.prefixId,
    CODES = _require2.CODES;

var _require3 = require('../../utils'),
    getLoader = _require3.getLoader;

module.exports = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, _ref2) {
    var actions, getNode, getNodesByType, reporter, parentSpan, schema, store, cache, apiToken, previewMode, environment, apiUrl, instancePrefix, rawLocaleFallbacks, pageSize, logApiCalls, localeFallbacks, errorText, loader, context, activity;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            actions = _ref.actions, getNode = _ref.getNode, getNodesByType = _ref.getNodesByType, reporter = _ref.reporter, parentSpan = _ref.parentSpan, schema = _ref.schema, store = _ref.store, cache = _ref.cache;
            apiToken = _ref2.apiToken, previewMode = _ref2.previewMode, environment = _ref2.environment, apiUrl = _ref2.apiUrl, instancePrefix = _ref2.instancePrefix, rawLocaleFallbacks = _ref2.localeFallbacks, pageSize = _ref2.pageSize, logApiCalls = _ref2.logApiCalls;
            localeFallbacks = rawLocaleFallbacks || {};

            if (!apiToken) {
              errorText = "API token must be provided!";
              reporter.panic({
                id: prefixId(CODES.MissingAPIToken),
                context: {
                  sourceMessage: errorText
                }
              }, new Error(errorText));
            }

            _context.next = 6;
            return getLoader({
              cache: cache,
              apiToken: apiToken,
              previewMode: previewMode,
              environment: environment,
              apiUrl: apiUrl,
              pageSize: pageSize,
              logApiCalls: logApiCalls,
              loadStateFromCache: !!process.env.GATSBY_WORKER_ID
            });

          case 6:
            loader = _context.sent;
            context = {
              entitiesRepo: loader.entitiesRepo,
              actions: actions,
              getNode: getNode,
              getNodesByType: getNodesByType,
              localeFallbacks: localeFallbacks,
              schema: schema,
              store: store,
              cache: cache,
              generateType: function generateType(type) {
                return "DatoCms".concat(instancePrefix ? pascalize(instancePrefix) : '').concat(type);
              }
            };
            activity = reporter.activityTimer("loading DatoCMS schema", {
              parentSpan: parentSpan
            });
            activity.start();

            if (process.env.GATSBY_WORKER_ID) {
              _context.next = 15;
              break;
            }

            _context.next = 13;
            return loader.loadSchema();

          case 13:
            _context.next = 15;
            return loader.saveStateToCache(cache);

          case 15:
            activity.end();
            createTypes(context);

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref3.apply(this, arguments);
  };
}();