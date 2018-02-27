/* jslint node: true */

const expect = require('chai').expect,
      lab = exports.lab = require('lab').script(),
      describe = lab.describe,
      it = lab.it,
      Schema = require('../lib/schema'),
      Query = require('../lib/query'),
      schema = Schema.fromFile('test/samples/swapi-schema.graphql'),
      deprecation = require('../lib/deprecation');

describe('deprecation', () => {

  describe("#reportForQuery", () => {

    const badQuery = Query.fromFile('test/samples/deprecation-query.graphql');
    const cleanQuery = Query.fromFile('test/samples/clean-query.graphql');

    it('should print messages when fields that are deprecated are queried', (done) => {
      deprecation.reportForQuery(schema, badQuery).then(output => {
        expect(output).to.contain("has the following deprecation warnings");
        expect(output).to.contain("The field Film.species is deprecated. Test, use speciesConnection");
        expect(output).to.contain("The field Film.planets is deprecated. Test, use planetConnection");
        done();
      });
    });

  });

});
