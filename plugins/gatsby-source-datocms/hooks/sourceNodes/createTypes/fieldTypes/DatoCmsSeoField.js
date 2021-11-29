"use strict";

module.exports = function (_ref) {
  var actions = _ref.actions,
      schema = _ref.schema,
      generateType = _ref.generateType;
  actions.createTypes([schema.buildObjectType({
    name: generateType('SeoField'),
    extensions: {
      infer: false
    },
    fields: {
      title: 'String',
      description: 'String',
      twitterCard: 'String',
      image: {
        type: generateType('Asset'),
        resolve: function resolve(fieldValue, args, context) {
          if (fieldValue && fieldValue.image) {
            return context.nodeModel.getNodeById({
              id: "".concat(generateType('Asset'), "-").concat(fieldValue.image)
            });
          }
        }
      }
    }
  })]);
};