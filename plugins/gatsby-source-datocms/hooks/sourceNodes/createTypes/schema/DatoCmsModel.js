"use strict";

module.exports = function (_ref) {
  var actions = _ref.actions,
      schema = _ref.schema,
      generateType = _ref.generateType;
  actions.createTypes([schema.buildObjectType({
    name: generateType('Model'),
    extensions: {
      infer: false
    },
    fields: {
      name: 'String',
      singleton: 'Boolean',
      sortable: 'Boolean',
      apiKey: 'String',
      orderingDirection: 'String',
      tree: 'Boolean',
      modularBlock: 'Boolean',
      draftModeActive: 'Boolean',
      allLocalesRequired: 'Boolean',
      collectionAppeareance: 'String',
      hasSingletonItem: 'Boolean',
      originalId: 'String',
      fields: {
        type: 'DatoCmsFaviconMetaTags',
        extensions: {
          link: {
            by: 'id',
            from: 'fields___NODE'
          }
        }
      }
    },
    interfaces: ['Node']
  })]);
};