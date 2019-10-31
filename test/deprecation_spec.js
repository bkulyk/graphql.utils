/* jslint node: true */

const expect = require('chai').expect;
const { describe, it } = exports.lab = require('@hapi/lab').script();

const Schema = require('../lib/schema');
const Query = require('../lib/query');

const schema = Schema.fromFile('test/samples/swapi-schema.graphql');
const deprecation = require('../lib/deprecation');
const badQuery = Query.fromFile('test/samples/deprecation-query.graphql');
const badQueryNoName = Query.fromFile('test/samples/deprecation-query-no-name.graphql');
const cleanQuery = Query.fromFile('test/samples/clean-query.graphql');

describe('deprecation', () => {
  describe("#reportForQuery", () => {
    it('should print messages when fields that are deprecated are queried', async () => {
      const output = await deprecation.reportForQuery(schema, badQuery);

      expect(output).to.contain("has the following deprecation warnings");
      expect(output).to.contain("The field Film.species is deprecated. Test, use speciesConnection");
      expect(output).to.contain("The field Film.planets is deprecated. Test, use planetConnection");
    });

    it('should print messages when fields that are deprecated are queried', async () => {
      const output = await deprecation.reportForQuery(schema, badQueryNoName);

      expect(output).to.contain("has the following deprecation warnings");
      expect(output).to.contain("The field Film.species is deprecated. Test, use speciesConnection");
      expect(output).to.contain("The field Film.planets is deprecated. Test, use planetConnection");
    });

    it('should print nothing for a query with no deprecations', async () => {
      const output = await deprecation.reportForQuery(schema, cleanQuery);

      expect(output).to.equal("");
    });
  });
});
