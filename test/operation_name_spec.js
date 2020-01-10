/* jslint node: true */

const expect = require('chai').expect;
const { describe, it } = exports.lab = require('@hapi/lab').script();
const Query = require('../lib/query');
const op = require('../lib/operation_name');

describe('operation_name', () => {
  describe('#getOperationNameFromQuery', () => {
    const goodQuery = Query.fromFile('test/samples/deprecation-query.graphql');

    it('should be able to parse the operation name from a query', () => {
      expect(op.getOperationNameFromQuery(goodQuery)).to.equal('speciesByFilm');
    });

    it('should return null if the query has no name', () => {
      expect(op.getOperationNameFromQuery("{ version }")).to.equal(null);
    });

    it('should return null if no query was provided', () => {
      expect(op.getOperationNameFromQuery(null)).to.equal(null);
    });
  });
});
