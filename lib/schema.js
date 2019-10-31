/* jslint node: true */

const request = require('request-promise');
const fs = require('fs');
const { introspectionQuery } = require('graphql/utilities/introspectionQuery');
const { makeExecutableSchema } = require('graphql-tools');
const { buildClientSchema } = require('graphql/utilities/buildClientSchema');
const { printSchema } = require('graphql/utilities/schemaPrinter');

const downloadJSONSchema = graphQlUrl => request(
  graphQlUrl || process.env.GRAPHQL_URL,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: introspectionQuery }),
    json: true,
  }
).then(({ data }) => data);

const getSchema = graphQlUrl => downloadJSONSchema(graphQlUrl).then(jsonToSchema);

const jsonToGraphQL = jsonSchema => printIDL(jsonToSchema(jsonSchema));

const jsonToSchema = buildClientSchema;

const graphqlToSchema = typeDefs => makeExecutableSchema({
  typeDefs,
  resolverValidationOptions: { requireResolversForResolveType: false },
});

const fromFile = (path) => {
  const contents = fs.readFileSync(path).toString();
  if (contents.trim()[0] === '{')
    return jsonToSchema(JSON.parse(contents));
  return graphqlToSchema(contents);
};

const printIDL = schema => printSchema(schema, { commentDescriptions: true });

module.exports = {
  getSchema,
  downloadJSONSchema,
  jsonToGraphQL,
  graphqlToSchema,
  fromFile,
  printIDL
};
