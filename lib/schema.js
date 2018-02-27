/* jslint node: true */

const P = require('bluebird'),
      fs = require('fs');

const downloadJSONSchema = (graphQlUrl) => {
  const request = require('request'),
        requestAsync = P.promisify(request),
        introspectionQuery = require('graphql/utilities/introspectionQuery').introspectionQuery;

  return requestAsync(graphQlUrl || process.env.GRAPHQL_URL, {method: 'POST', headers: {'Content-Type': 'application/json',}, body: JSON.stringify({query: introspectionQuery}),}).then(resp => {
    return JSON.parse(resp.body).data;
  });
};

const getSchema = (graphQlUrl) => {
  return downloadJSONSchema(graphQlUrl).then(jsonToSchema);
};

const jsonToGraphQL = (jsonSchema) => {
  return printIDL(jsonToSchema(jsonSchema));
};

const jsonToSchema = (jsonSchema) => {
  return require('graphql/utilities/buildClientSchema').buildClientSchema(jsonSchema);
}

const graphqlToSchema = (idlSchema) => {
  return require('graphql-tools').makeExecutableSchema({typeDefs: idlSchema});
}

const fromFile = (path) => {
  const contents = fs.readFileSync(path).toString();
  if (contents.trim()[0] === '{')
    return jsonToSchema(JSON.parse(contents));
  return graphqlToSchema(contents);
};

const printIDL = (schema) => {
  return require('graphql/utilities/schemaPrinter').printSchema(schema, {commentDescriptions: true});
};

module.exports = {
  getSchema,
  downloadJSONSchema,
  jsonToGraphQL,
  graphqlToSchema,
  fromFile,
  printIDL
};
