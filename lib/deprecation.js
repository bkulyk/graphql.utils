/* jslint node: true */

const P = require('bluebird'),
      R = require('ramda'),
      findDeprecatedUsage = require('graphql/utilities/findDeprecatedUsages').findDeprecatedUsages,
      parse = require('graphql/language/parser').parse,
      isBlank = (x) => R.isNil(x) || R.isEmpty(x),
      getOperationNameFromQuery = require('./operation_name').getOperationNameFromQuery,
      chalk = require('chalk'),
      alertSymbol = "🛑  ";

const getDeprecateionWarnings = async (schema, query) => {
  try {
    const parsedQuery = parse(query);
    return findDeprecatedUsage(schema, parsedQuery);
  } catch (e) {
    return null;
  }
};

const outputReportLine = (message) => {
  const line = [message.message];
  line.push("    Locations: " + JSON.stringify(message.locations));
  return line.join("\n");
};

const outputReport = async ({clientID, query, messages}) => {
  const op = getOperationNameFromQuery(query);
  const line = [];

  line.push(!R.isNil(op) ? 'query ' + chalk.green(op) : 'unknown query');

  if (clientID)
    line.push(` for client ${chalk.yellow(clientID)}`);

  line.push(" has the following deprecation warnings:\n\n");
  line.push(alertSymbol + R.map(outputReportLine, messages).join("\n\n" + alertSymbol) + "\n");
  return line.join("");
};

const reportForQuery = async (schema, query) => {
  const messages = await getDeprecateionWarnings(schema, query);
  return !R.isEmpty(messages) ? outputReport({query, messages}) : '';
}

module.exports = {
  reportForQuery,
  getDeprecateionWarnings
};
