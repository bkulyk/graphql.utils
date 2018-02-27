/* jslint node: true */

const expect = require('chai').expect,
      lab = exports.lab = require('lab').script(),
      describe = lab.describe,
      it = lab.it,
      Schema = require('../lib/schema'),
      Query = require('../lib/query');

describe('schema', () => {

  describe("#fromFile", () => {
    it('should be able to load a json schema file', (done) => {
      const s = Schema.fromFile('test/samples/simple-schema.json');
      const x = JSON.parse(JSON.stringify(s))
      expect(x._queryType).to.equal("Query");
      done();
    });

    it('should be able to load a graphql scheam file', (done) => {
      const s = Schema.fromFile('test/samples/simple-schema.graphql');
      const x = JSON.parse(JSON.stringify(s))
      expect(x._queryType).to.equal("Query");
      done();
    });
  });

  describe('#downloadJSONSchema', () => {
    it('should be able to download the GRAPHQL_URL schema if no url was provided', (done) => {
      process.env.GRAPHQL_URL = "http://gdom.graphene-python.org/graphql";
      Schema.downloadJSONSchema().then(res => {
        expect(res.__schema.queryType.name).to.equal('Query');
        done();
      });
    });

    it('should be able to download the schema with a provided url', (done) => {
      Schema.downloadJSONSchema("http://gdom.graphene-python.org/graphql").then(res => {
        expect(res.__schema.queryType.name).to.equal('Query');
        done();
      });
    });
  });

  describe('#getSchema', () => {
    it('should download a schema and make it executable', (done) => {
      Schema.getSchema("http://gdom.graphene-python.org/graphql").then(s => {
        const x = JSON.parse(JSON.stringify(s))
        expect(x._queryType).to.equal("Query");
        done();
      });
    });
  });

  describe('#jsonToGraphQL', () => {
    it('should be able to convert a json schema to a graphql idl scheam', (done) => {
       const jsonSchema = require('./samples/simple-schema.json');
       const output = Schema.jsonToGraphQL(jsonSchema);
       expect(output).to.contain('scalar Long');
       expect(output).to.contain('version: String');
       done();
    });
  });

});
