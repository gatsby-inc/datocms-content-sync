"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var buildNode = require('../utils/buildNode');

var buildFaviconMetaTagsNode = require('./buildFaviconMetaTagsNode');

var objectAssign = require('object-assign');

var _require = require('datocms-client'),
    localizedRead = _require.localizedRead;

module.exports = function buildSiteNode(entity, _ref) {
  var _ref2;

  var entitiesRepo = _ref.entitiesRepo,
      localeFallbacks = _ref.localeFallbacks,
      generateType = _ref.generateType;
  return (_ref2 = []).concat.apply(_ref2, _toConsumableArray(entity.locales.map(function (locale) {
    var additionalNodesToCreate = [];
    var i18n = {
      locale: locale,
      fallbacks: localeFallbacks
    };
    var siteNode = buildNode(generateType('Site'), "".concat(entity.id, "-").concat(locale), function (node) {
      node.locale = locale;
      ['name', 'locales', 'domain', 'internalDomain', 'noIndex'].forEach(function (key) {
        return node[key] = entity[key];
      });
      var globalSeo = localizedRead(entity, 'globalSeo', entity.locales.length > 1, i18n);

      if (globalSeo) {
        node.globalSeo = objectAssign({}, globalSeo);

        if (globalSeo.fallbackSeo) {
          node.globalSeo.fallbackSeo = {
            title: node.globalSeo.fallbackSeo.title,
            description: node.globalSeo.fallbackSeo.description,
            twitterCard: node.globalSeo.fallbackSeo.twitterCard,
            image: node.globalSeo.fallbackSeo.image
          };
        }
      }

      if (entity.favicon) {
        var faviconNode = buildFaviconMetaTagsNode(node, entitiesRepo);
        additionalNodesToCreate.push(faviconNode);
        node.faviconMetaTags___NODE = faviconNode.id;
      }

      node.originalId = entity.id;
    });
    return [siteNode].concat(additionalNodesToCreate);
  })));
};