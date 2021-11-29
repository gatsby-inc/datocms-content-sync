"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var createNodeFromEntity = require('./createNodeFromEntity');

var destroyEntityNode = require('./destroyEntityNode');

var _require = require('../../errorMap'),
    prefixId = _require.prefixId,
    CODES = _require.CODES;

var Queue = require('promise-queue');

var _require2 = require('humps'),
    pascalize = _require2.pascalize;

var uniq = require('lodash.uniq');

var visit = require('unist-util-visit');

var _require3 = require('datocms-structured-text-utils'),
    isInlineItem = _require3.isInlineItem,
    isItemLink = _require3.isItemLink,
    isBlock = _require3.isBlock;

var _require4 = require('../../utils'),
    getLoader = _require4.getLoader;

var findAll = function findAll(document, predicate) {
  var result = [];
  visit(document, predicate, function (node) {
    result.push(node);
  });
  return result;
};

module.exports = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref, _ref2) {
    var actions, getNode, getNodesByType, reporter, parentSpan, schema, store, webhookBody, cache, apiToken, environment, disableLiveReload, previewMode, instancePrefix, apiUrl, rawLocaleFallbacks, pageSize, logApiCalls, localeFallbacks, errorText, loader, context, entity_id, entity_type, event_type, changesActivity, payload, linkedEntitiesIdsToFetch, linkedEntitiesPayload, _payload, activity, queue;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            actions = _ref.actions, getNode = _ref.getNode, getNodesByType = _ref.getNodesByType, reporter = _ref.reporter, parentSpan = _ref.parentSpan, schema = _ref.schema, store = _ref.store, webhookBody = _ref.webhookBody, cache = _ref.cache;
            apiToken = _ref2.apiToken, environment = _ref2.environment, disableLiveReload = _ref2.disableLiveReload, previewMode = _ref2.previewMode, instancePrefix = _ref2.instancePrefix, apiUrl = _ref2.apiUrl, rawLocaleFallbacks = _ref2.localeFallbacks, pageSize = _ref2.pageSize, logApiCalls = _ref2.logApiCalls;
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

            _context2.next = 6;
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
            loader = _context2.sent;
            context = {
              entitiesRepo: loader.entitiesRepo,
              actions: actions,
              getNode: getNode,
              getNodesByType: getNodesByType,
              localeFallbacks: localeFallbacks,
              schema: schema,
              store: store,
              cache: cache,
              previewMode: previewMode,
              generateType: function generateType(type) {
                return "DatoCms".concat(instancePrefix ? pascalize(instancePrefix) : '').concat(type);
              }
            };

            if (!(webhookBody && Object.keys(webhookBody).length)) {
              _context2.next = 44;
              break;
            }

            entity_id = webhookBody.entity_id, entity_type = webhookBody.entity_type, event_type = webhookBody.event_type;
            reporter.info("Received ".concat(event_type, " event for ").concat(entity_type, " ").concat(entity_id, " from DatoCMS"));
            changesActivity = reporter.activityTimer("loading DatoCMS content changes", {
              parentSpan: parentSpan
            });
            changesActivity.start();
            _context2.t0 = entity_type;
            _context2.next = _context2.t0 === 'item' ? 16 : _context2.t0 === 'upload' ? 31 : 40;
            break;

          case 16:
            if (!(event_type === 'publish' || event_type === "update" || event_type === 'create')) {
              _context2.next = 29;
              break;
            }

            _context2.next = 19;
            return loader.client.items.all({
              'filter[ids]': [entity_id].join(','),
              version: previewMode ? 'draft' : 'published'
            }, {
              deserializeResponse: false,
              allPages: true
            });

          case 19:
            payload = _context2.sent;

            if (!payload) {
              _context2.next = 27;
              break;
            }

            // `rich_text`, `links`, `link` fields link to other entities and we need to
            // fetch them separately to make sure we have all the data
            linkedEntitiesIdsToFetch = payload.data.reduce(function (collectedIds, payload) {
              var item_type_rel = payload.relationships.item_type.data;
              var itemTypeForThis = loader.entitiesRepo.findEntity(item_type_rel.type, item_type_rel.id);
              var fieldsToResolve = itemTypeForThis.fields.filter(function (fieldDef) {
                return ["rich_text", "links", "link", "structured_text"].includes(fieldDef.fieldType);
              });

              function addRawValueToCollectedIds(fieldInfo, fieldRawValue) {
                if (['links', 'rich_text'].includes(fieldInfo.fieldType) && Array.isArray(fieldRawValue)) {
                  fieldRawValue.forEach(collectedIds.add.bind(collectedIds));
                } else if (fieldInfo.fieldType === 'link' && fieldRawValue) {
                  collectedIds.add(fieldRawValue);
                } else if (fieldInfo.fieldType === 'structured_text' && fieldRawValue) {
                  uniq(findAll(fieldRawValue.document, [isInlineItem, isItemLink, isBlock]).map(function (node) {
                    return node.item;
                  })).forEach(collectedIds.add.bind(collectedIds));
                }
              }

              fieldsToResolve.forEach(function (fieldInfo) {
                var fieldRawValue = payload.attributes[fieldInfo.apiKey];

                if (fieldInfo.localized) {
                  // Localized fields raw values are object with lang codes
                  // as keys. We need to iterate over properties to
                  // collect ids from all languages
                  Object.values(fieldRawValue).forEach(function (fieldTranslationRawValue) {
                    addRawValueToCollectedIds(fieldInfo, fieldTranslationRawValue);
                  });
                } else {
                  addRawValueToCollectedIds(fieldInfo, fieldRawValue);
                }
              });
              return collectedIds;
            }, new Set());
            _context2.next = 24;
            return loader.client.items.all({
              'filter[ids]': Array.from(linkedEntitiesIdsToFetch).join(','),
              version: previewMode ? 'draft' : 'published'
            }, {
              deserializeResponse: false,
              allPages: true
            });

          case 24:
            linkedEntitiesPayload = _context2.sent;
            // attach included portion of payload
            payload.included = linkedEntitiesPayload.data;
            loader.entitiesRepo.upsertEntities(payload);

          case 27:
            _context2.next = 30;
            break;

          case 29:
            if (event_type === 'unpublish' || event_type === 'delete') {
              loader.entitiesRepo.destroyEntities('item', [entity_id]);
            } else {
              reporter.warn("Invalid event type ".concat(event_type));
            }

          case 30:
            return _context2.abrupt("break", 42);

          case 31:
            if (!(event_type === 'create' || event_type === "update")) {
              _context2.next = 38;
              break;
            }

            _context2.next = 34;
            return loader.client.uploads.all({
              'filter[ids]': [entity_id].join(','),
              version: previewMode ? 'draft' : 'published'
            }, {
              deserializeResponse: false,
              allPages: true
            });

          case 34:
            _payload = _context2.sent;

            if (_payload) {
              loader.entitiesRepo.upsertEntities(_payload);
            }

            _context2.next = 39;
            break;

          case 38:
            if (event_type === 'delete') {
              loader.entitiesRepo.destroyEntities('upload', [entity_id]);
            } else {
              reporter.warn("Invalid event type ".concat(event_type));
            }

          case 39:
            return _context2.abrupt("break", 42);

          case 40:
            reporter.warn("Invalid entity type ".concat(entity_type));
            return _context2.abrupt("break", 42);

          case 42:
            changesActivity.end();
            return _context2.abrupt("return");

          case 44:
            activity = reporter.activityTimer("loading DatoCMS content", {
              parentSpan: parentSpan
            });
            activity.start();
            loader.entitiesRepo.addUpsertListener(function (entity) {
              createNodeFromEntity(entity, context);
            });
            loader.entitiesRepo.addDestroyListener(function (entity) {
              destroyEntityNode(entity, context);
            });

            if (process.env.GATSBY_WORKER_ID) {
              _context2.next = 53;
              break;
            }

            _context2.next = 51;
            return loader.load();

          case 51:
            _context2.next = 53;
            return loader.saveStateToCache(cache);

          case 53:
            activity.end();
            queue = new Queue(1, Infinity);

            if (process.env.NODE_ENV !== "production" && !disableLiveReload) {
              loader.watch(function (loadPromise) {
                queue.add( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                  var activity;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          activity = reporter.activityTimer("detected change in DatoCMS content, loading new data", {
                            parentSpan: parentSpan
                          });
                          activity.start();
                          _context.next = 4;
                          return loadPromise;

                        case 4:
                          activity.end();

                        case 5:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                })));
              });
            }

          case 56:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x, _x2) {
    return _ref3.apply(this, arguments);
  };
}();