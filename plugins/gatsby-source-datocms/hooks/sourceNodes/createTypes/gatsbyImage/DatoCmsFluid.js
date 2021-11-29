"use strict";

var getBase64 = require('../utils/getBase64');

var getTracedSVG = require('../utils/getTracedSVG');

module.exports = function (_ref) {
  var actions = _ref.actions,
      schema = _ref.schema,
      store = _ref.store,
      cache = _ref.cache;
  actions.createTypes([schema.buildObjectType({
    name: 'DatoCmsFluid',
    extensions: {
      infer: false
    },
    fields: {
      base64: {
        type: 'String',
        resolve: function resolve(image) {
          return getBase64(image, cache);
        }
      },
      tracedSVG: {
        type: 'String',
        resolve: function resolve(image) {
          return getTracedSVG(image, cache);
        }
      },
      aspectRatio: 'Float!',
      width: 'Int',
      height: 'Int',
      src: 'String!',
      srcSet: 'String!',
      sizes: 'String!'
    }
  })]);
};