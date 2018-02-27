/* jslint node: true */

const expect = require('chai').expect,
      lab = exports.lab = require('lab').script(),
      describe = lab.describe,
      it = lab.it,
      Schema = require('../lib/schema'),
      Query = require('../lib/query'),
      op = require('../lib/operation_name');

describe('operation_name', () => {

  describe('#getOperationNameFromQuery', () => {

    const goodQuery = Query.fromFile('test/samples/deprecation-query.graphql');

    it('should be able to parse the operation name from a query', (done) => {
      expect(op.getOperationNameFromQuery(goodQuery)).to.equal('speciesByFilm');
      done();
    });

    it('should return null if the query has no name', (done) => {
      expect(op.getOperationNameFromQuery("{ version }")).to.equal(null);
      done();
    });

    it ('shoul return null if no query was provided', (done) => {
      expect(op.getOperationNameFromQuery(null)).to.equal(null);
      done();
    });

  });

});
