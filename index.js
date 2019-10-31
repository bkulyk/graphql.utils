#!/usr/bin/env node

const dotenv = require('dotenv');
const chalk = require('chalk');
const app = require('commander');
const { resolve: resolvePath } = require('path');
const Schema = require('./lib/schema');

const stderr = new console.Console(process.stderr);
dotenv.config();

const getSchemaAndQueries = (schema_file, query_file) => {
  const schema = require('./lib/schema').fromFile(resolvePath(schema_file));
  const query = require('./lib/query').fromFile(resolvePath(query_file));
  return { schema, query };
}

app.command('get-schema [graphql_endpoint]').description('Fetch a GraphQL schema as a file.').option('--json', 'output in json format').action(async (graphql_endpoint, {json}) => {
  stderr.log(chalk.yellow('downloading schema...'));
  const jsonSchema = await Schema.downloadJSONSchema(graphql_endpoint);
  console.log(json ? JSON.stringify(jsonSchema, null, 2) : Schema.jsonToGraphQL(jsonSchema));
});

app.command('deprecation-check <schema_file> <query_file>').description(`Check a single query against a local schema for ${chalk.yellow('deprecation')} warnings`).action(async (schema_file, query_file) => {
  const sq = getSchemaAndQueries(schema_file, query_file);
  console.log(await require('./lib/deprecation').reportForQuery(sq.schema, sq.query));
});

app.command('validation-check <schema_file> <query_file>').description(`Check a single query against a local schema for ${chalk.yellow('validation')} warnings`).action(async (schema_file, query_file) => {
  const sq = getSchemaAndQueries(schema_file, query_file);
  console.log(await require('./lib/validation').reportForQuery(sq.schema, sq.query));
});

app.command('check-query <schema_file> <query_file>').description(`Check a single query for ${chalk.yellow('validation')} and ${chalk.yellow('deprecation')} errors`).action(async (schema_file, query_file) => {
  const sq = getSchemaAndQueries(schema_file, query_file);
  const output = await Promise.all([
    require('./lib/validation').reportForQuery(sq.schema, sq.query),
    require('./lib/deprecation').reportForQuery(sq.schema, sq.query),
  ]);
  console.log(output.join("\n").trim());
});

app.command('json-to-graphql <json_schema_file>').action(async (json_schema_file) => {
  console.log(Schema.printIDL(Schema.fromFile(resolvePath(json_schema_file))));
});

app.version('0.3').parse(process.argv);

if (!process.argv.slice(2).length) {
  app.outputHelp();
  console.log('');
}
