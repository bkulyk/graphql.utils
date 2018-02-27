/* jslint node: true */

const graphql = require('graphql'),
      R = require('ramda'),
      chalk = require('chalk'),
      getOperationNameFromQuery = require('./operation_name').getOperationNameFromQuery;

const getErrorMessage = (error) => {
  const output = [];
  output.push("🛑  " + error.message);
  output.push("   Locations: " + JSON.stringify(error.locations));
  output.push("");
  return output.join("\n");
}

const getErrors = (schema, query) => {
  return graphql.validate(schema, graphql.parse(query));
};

const reportForQuery = (schema, query) => {
  const errors = R.reject(R.isNil, R.map(getErrorMessage, getErrors(schema, query)));
  if (!R.isEmpty(errors)) {
    const output = [];
    output.push(chalk.green(getOperationNameFromQuery(query)) + " query has the following validation errors: \n");
    output.push(errors.join("\n"));
    return output.join("\n");
  }
  return '';
};

module.exports = {
  getErrors,
  reportForQuery
};
