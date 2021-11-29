"use strict";

module.exports = function () {
  return {
    type: 'Date',
    extensions: {
      dateformat: {}
    },
    resolveForSimpleField: function resolveForSimpleField(value) {
      return value;
    }
  };
};