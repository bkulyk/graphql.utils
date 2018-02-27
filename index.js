#!/usr/bin/env node

const dotenv = require('dotenv'),
      chalk = require('chalk'),
      app = require('commander'),
      resolvePath = require('path').resolve,
      stderr = new console.Console(process.stderr);

dotenv.config();

const Schema = require('./lib/schema');

const oneMoment = () => {
  stderr.log(chalk.yellow("one moment please...\n"));
};

const getSchemaAndQueryies = (schema_file, query_file) => {
  const schema = require('./lib/schema').fromFile(resolvePath(schema_file));
  const query = require('./lib/query').fromFile(resolvePath(query_file));
  return {schema, query};
}

app.command('get-schema [graphql_endpoint]').description('Fetch a GraphQL schema as a file.').option('--json', 'output in json format').action(async (graphql_endpoint, {json}) => {
  stderr.log(chalk.yellow('downloading schema...'));
  const jsonSchema = await Schema.downloadJSONSchema(graphql_endpoint);
  console.log(json ? JSON.stringify(jsonSchema, null, 2) : Schema.jsonToGraphQL(jsonSchema));
});

app.command('deprecation-check <schema_file> <query_file>').description(`Check a single query against a local schema for ${chalk.yellow('deprecation')} warnings`).action(async (schema_file, query_file) => {
  oneMoment();
  const sq = getSchemaAndQueryies(schema_file, query_file);
  console.log(await require('./lib/deprecation').reportForQuery(sq.schema, sq.query));
});

app.command('validation-check <schema_file> <query_file>').description(`Check a single query against a local schema for ${chalk.yellow('validation')} warnings`).action(async (schema_file, query_file) => {
  oneMoment();
  const sq = getSchemaAndQueryies(schema_file, query_file);
  console.log(await require('./lib/validation').reportForQuery(sq.schema, sq.query));
});

app.command('check-query <schema_file> <query_file>').description(`Check a single query for ${chalk.yellow('validation')} and ${chalk.yellow('deprecation')} errors`).action(async (schema_file, query_file) => {
  oneMoment();
  const sq = getSchemaAndQueryies(schema_file, query_file);
  const output = [];
  output.push(await require('./lib/validation').reportForQuery(sq.schema, sq.query));
  output.push(await require('./lib/deprecation').reportForQuery(sq.schema, sq.query));
  console.log(output.join("\n").trim());
});

app.command('json-to-graphql <json_schema_file>').action(async (json_schema_file) => {
  oneMoment();
  console.log(Schema.printIDL(Schema.fromFile(resolvePath(json_schema_file))));
});

app.version('0.2').parse(process.argv);

if (!process.argv.slice(2).length) {
  app.outputHelp();
  console.log('');
}
