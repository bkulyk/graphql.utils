/* jslint node: true */

const R = require('ramda');
const chalk = require('chalk');
const { parse } = require('graphql/language/parser');
const { findDeprecatedUsages } = require('graphql/utilities/findDeprecatedUsages');
const { getOperationNameFromQuery } = require('./operation_name');

const isBlank = (x) => R.isNil(x) || R.isEmpty(x);
const alertSymbol = "⯃  ";

const getDeprecationWarnings = async (schema, query) => {
  try {
    return findDeprecatedUsages(schema, parse(query));
  } catch (e) {
    return null;
  }
};

const outputReportLine = message =>
  `${message.message}  Locations: ${JSON.stringify(message.locations)}`;

const outputReport = async ({ query, messages }) => {
  const op = getOperationNameFromQuery(query);

  return [
    !R.isNil(op) ? 'query ' + chalk.green(op) : 'query',
    " has the following deprecation warnings:\n\n",
    alertSymbol + R.map(outputReportLine, messages).join("\n\n" + alertSymbol) + "\n"
  ].join('');
};

const reportForQuery = async (schema, query) => {
  const messages = await getDeprecationWarnings(schema, query);
  return !isBlank(messages) ? outputReport({ query, messages }) : '';
};

module.exports = {
  reportForQuery,
};
