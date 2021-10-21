"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var fs = require('fs-extra');

var createNodeFromEntity = require('./createNodeFromEntity');

var destroyEntityNode = require('./destroyEntityNode');

var _require = require('../onPreInit/errorMap'),
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
    getClient = _require4.getClient,
    getLoader = _require4.getLoader;

var findAll = function findAll(document, predicate) {
  var result = [];
  visit(document, predicate, function (node) {
    result.push(node);
  });
  return result;
};

var datocmsCreateNodeManifest = function datocmsCreateNodeManifest(_ref) {
  var node = _ref.node,
      entity_id = _ref.entity_id,
      unstable_createNodeManifest = _ref.unstable_createNodeManifest,
      previewMode = _ref.previewMode;
  var createNodeManifestIsSupported = typeof unstable_createNodeManifest === "function";
  var shouldCreateNodeManifest = createNodeManifestIsSupported && previewMode;
  console.log(JSON.stringify(node));

  if (true) {
    // Example manifestId: "34324203-2021-07-08T21:52:28.791+01:00"
    // Example node.id: "DatoCmsPost-1233566-en"
    var manifestId = "".concat(node.id, "-").concat(node.meta.updated_at);
    node.id = "DatoCMSPost-".concat(entity_id, "-en");
    console.log(entity_id);
    console.info("DatoCMS: Creating node manifest with id ".concat(manifestId)); // console.log(JSON.stringify(node));

    unstable_createNodeManifest({
      manifestId: manifestId,
      node: node
    });
  } else if (previewMode && !createNodeManifestIsSupported) {
    console.warn("DatoCMS: Your version of Gatsby core doesn't support Content Sync (via the unstable_createNodeManifest action). Please upgrade to the latest version to use Content Sync in your site.");
  }
};

module.exports = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2, _ref3) {
    var actions, getNode, getNodesByType, reporter, parentSpan, schema, store, webhookBody, apiToken, environment, disableLiveReload, previewMode, instancePrefix, apiUrl, rawLocaleFallbacks, localeFallbacks, unstable_createNodeManifest, errorText, client, loader, program, cacheDir, context, _entity_id, entity_type, event_type, changesActivity, _payload, linkedEntitiesIdsToFetch, linkedEntitiesPayload, _payload2, activity, payload, queue;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            actions = _ref2.actions, getNode = _ref2.getNode, getNodesByType = _ref2.getNodesByType, reporter = _ref2.reporter, parentSpan = _ref2.parentSpan, schema = _ref2.schema, store = _ref2.store, webhookBody = _ref2.webhookBody;
            apiToken = _ref3.apiToken, environment = _ref3.environment, disableLiveReload = _ref3.disableLiveReload, previewMode = _ref3.previewMode, instancePrefix = _ref3.instancePrefix, apiUrl = _ref3.apiUrl, rawLocaleFallbacks = _ref3.localeFallbacks;
            localeFallbacks = rawLocaleFallbacks || {};
            unstable_createNodeManifest = actions.unstable_createNodeManifest;

            if (!apiToken) {
              errorText = "API token must be provided!";
              reporter.panic({
                id: prefixId(CODES.MissingAPIToken),
                context: {
                  sourceMessage: errorText
                }
              }, new Error(errorText));
            }

            if (process.env.GATSBY_IS_PREVIEW === "true") {
              previewMode = true;
            }

            client = getClient({
              apiToken: apiToken,
              previewMode: previewMode,
              environment: environment,
              apiUrl: apiUrl
            });
            loader = getLoader({
              apiToken: apiToken,
              previewMode: previewMode,
              environment: environment,
              apiUrl: apiUrl
            });
            program = store.getState().program;
            cacheDir = "".concat(program.directory, "/.cache/datocms-assets");

            if (!fs.existsSync(cacheDir)) {
              fs.mkdirSync(cacheDir);
            }

            context = {
              entitiesRepo: loader.entitiesRepo,
              actions: actions,
              getNode: getNode,
              getNodesByType: getNodesByType,
              localeFallbacks: localeFallbacks,
              schema: schema,
              store: store,
              cacheDir: cacheDir,
              generateType: function generateType(type) {
                return "DatoCms".concat(instancePrefix ? pascalize(instancePrefix) : '').concat(type);
              }
            };

            if (!(webhookBody && Object.keys(webhookBody).length)) {
              _context.next = 48;
              break;
            }

            _entity_id = webhookBody.entity_id, entity_type = webhookBody.entity_type, event_type = webhookBody.event_type;
            reporter.info("Received ".concat(event_type, " event for ").concat(entity_type, " ").concat(_entity_id, " from DatoCMS"));
            changesActivity = reporter.activityTimer("loading DatoCMS content changes", {
              parentSpan: parentSpan
            });
            changesActivity.start();
            _context.t0 = entity_type;
            _context.next = _context.t0 === 'item' ? 20 : _context.t0 === 'upload' ? 35 : 44;
            break;

          case 20:
            if (!(event_type === 'publish' || event_type === "update" || event_type === 'create')) {
              _context.next = 33;
              break;
            }

            _context.next = 23;
            return client.items.all({
              'filter[ids]': [_entity_id].join(','),
              version: previewMode ? 'draft' : 'published'
            }, {
              deserializeResponse: false,
              allPages: true
            });

          case 23:
            _payload = _context.sent;

            if (!_payload) {
              _context.next = 31;
              break;
            }

            // `rich_text`, `links`, `link` fields link to other entities and we need to
            // fetch them separately to make sure we have all the data
            linkedEntitiesIdsToFetch = _payload.data.reduce(function (collectedIds, payload) {
              datocmsCreateNodeManifest({
                node: payload,
                entity_id: _entity_id,
                unstable_createNodeManifest: unstable_createNodeManifest,
                previewMode: previewMode
              });
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
            _context.next = 28;
            return client.items.all({
              'filter[ids]': Array.from(linkedEntitiesIdsToFetch).join(','),
              version: previewMode ? 'draft' : 'published'
            }, {
              deserializeResponse: false,
              allPages: true
            });

          case 28:
            linkedEntitiesPayload = _context.sent;
            // attach included portion of payload
            _payload.included = linkedEntitiesPayload.data;
            loader.entitiesRepo.upsertEntities(_payload);

          case 31:
            _context.next = 34;
            break;

          case 33:
            if (event_type === 'unpublish' || event_type === 'delete') {
              loader.entitiesRepo.destroyEntities('item', [_entity_id]);
            } else {
              reporter.warn("Invalid event type ".concat(event_type));
            }

          case 34:
            return _context.abrupt("break", 46);

          case 35:
            if (!(event_type === 'create' || event_type === "update")) {
              _context.next = 42;
              break;
            }

            _context.next = 38;
            return client.uploads.all({
              'filter[ids]': [_entity_id].join(','),
              version: previewMode ? 'draft' : 'published'
            }, {
              deserializeResponse: false,
              allPages: true
            });

          case 38:
            _payload2 = _context.sent;

            if (_payload2) {
              loader.entitiesRepo.upsertEntities(_payload2);
            }

            _context.next = 43;
            break;

          case 42:
            if (event_type === 'delete') {
              loader.entitiesRepo.destroyEntities('upload', [_entity_id]);
            } else {
              reporter.warn("Invalid event type ".concat(event_type));
            }

          case 43:
            return _context.abrupt("break", 46);

          case 44:
            reporter.warn("Invalid entity type ".concat(entity_type));
            return _context.abrupt("break", 46);

          case 46:
            changesActivity.end();
            return _context.abrupt("return");

          case 48:
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
            _context.next = 54;
            return loader.load();

          case 54:
            _context.next = 56;
            return client.items.all({
              version: "draft"
            }, {
              deserializeResponse: false,
              allPages: true
            });

          case 56:
            payload = _context.sent;
            console.log("LENGTH", payload.data.length);
            payload.data.forEach(function (node) {
              // if (
              //   node.meta.updated_at &&
              //   Date.now() - new Date(node.meta.updated_at).getTime() <=
              //     // milliseconds
              //     1000 *
              //       // seconds
              //       60 *
              //       // minutes
              //       60 *
              //       // hours
              //       48
              // ) {
              datocmsCreateNodeManifest({
                node: node,
                entity_id: entity_id,
                unstable_createNodeManifest: unstable_createNodeManifest,
                previewMode: previewMode,
                getNode: getNode
              }); // }
            });
            activity.end();
            queue = new Queue(1, Infinity); // if (process.env.NODE_ENV !== `production` && !disableLiveReload) {
            //   loader.watch(loadPromise => {
            //     queue.add(async () => {
            //       const activity = reporter.activityTimer(
            //         `detected change in DatoCMS content, loading new data`,
            //         { parentSpan },
            //       );
            //       activity.start();
            //       await loadPromise;
            //       activity.end();
            //     });
            //   });
            // }

          case 61:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref4.apply(this, arguments);
  };
}();