"use strict";

require('core-js/stable');

require('regenerator-runtime/runtime');

var onPreInit = require('./hooks/onPreInit');

exports.onPreInit = onPreInit;

var createSchemaCustomization = require('./hooks/createSchemaCustomization');

exports.createSchemaCustomization = createSchemaCustomization;

var sourceNodes = require('./hooks/sourceNodes');

exports.sourceNodes = sourceNodes; // exports.onCreateNode = ({ node, actions }) => {
//   // console.log(JSON.stringify(node));
//   const { unstable_createNodeManifest } = actions;
//   if (node?.internal?.owner === `gatsby-source-datocms`) {
//     console.log(node);
//   }
// };