/* jslint node: true */

const expect = require('chai').expect;
const { describe, it } = exports.lab = require('@hapi/lab').script();
const Schema = require('../lib/schema');
const Query = require('../lib/query');
const validation = require('../lib/validation');

describe('validation', () => {
  const schema = Schema.fromFile('test/samples/swapi-schema.graphql');
  const badQuery = Query.fromFile('test/samples/bad-query.graphql');
  const goodQuery = Query.fromFile('test/samples/deprecation-query.graphql');

  describe('#getErrors', () => {
    const subject = validation.getErrors;

    it('should find errors in a bad query', () => {
      expect(subject(schema, badQuery).length).to.equal(3);
    });

    it('should find nothing in a good query', () => {
      expect(subject(schema, goodQuery).length).to.equal(0);
    });
  });

  describe('#reportForQuery', () => {
    const subject = validation.reportForQuery;

    it('should find errors in a bad query', async () => {
      const output = await subject(schema, badQuery);
      expect(output).to.include('Field "episodeID" must not have a selection since type "Int" has no subfields');
      expect(output).to.include('Cannot query field "field_does_not_exist" on type "Film"');
      expect(output).to.include('Field "speciesConnection" of type "FilmSpeciesConnection" must have a selection of subfields');
    });

    it('should find nothing in a good query', async () => {
      const output = await subject(schema, goodQuery);
      expect(output).to.equal('');
    });
  });
});
