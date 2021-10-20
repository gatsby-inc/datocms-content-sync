require('core-js/stable');
require('regenerator-runtime/runtime');

const onPreInit = require('./hooks/onPreInit');
exports.onPreInit = onPreInit;

const createSchemaCustomization = require('./hooks/createSchemaCustomization');
exports.createSchemaCustomization = createSchemaCustomization;

const sourceNodes = require('./hooks/sourceNodes');
exports.sourceNodes = sourceNodes;

// exports.onCreateNode = ({ node, actions }) => {
//   // console.log(JSON.stringify(node));
//   const { unstable_createNodeManifest } = actions;

//   if (node?.internal?.owner === `gatsby-source-datocms`) {
//     console.log(node);
//   }
// };
