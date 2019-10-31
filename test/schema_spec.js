/* jslint node: true */

const expect = require('chai').expect;
const { describe, it } = exports.lab = require('@hapi/lab').script();
const nock = require('nock');
const Schema = require('../lib/schema');
const mockSchema = require('./samples/swapi-schema.json');

describe('schema', () => {
  describe("#fromFile", () => {
    it('should be able to load a json schema file', () => {
      const s = Schema.fromFile('test/samples/simple-schema.json');
      const x = JSON.parse(JSON.stringify(s))
      expect(x._queryType).to.equal("Query");
    });

    it('should be able to load a graphql schema file', () => {
      const s = Schema.fromFile('test/samples/simple-schema.graphql');
      const x = JSON.parse(JSON.stringify(s))
      expect(x._queryType).to.equal("Query");
    });
  });

  describe('#downloadJSONSchema', () => {
    const graphHost = nock('http://some-dummy-host.com');

    it('should be able to download the GRAPHQL_URL schema if no url was provided', async () => {
      graphHost.post('/graphql').reply(200, () => ({ data: mockSchema }));

      process.env.GRAPHQL_URL = "http://some-dummy-host.com/graphql";
      const res = await Schema.downloadJSONSchema();
      expect(res.__schema.queryType.name).to.equal('Root');
    });

    it('should be able to download the schema with a provided url', async () => {
      graphHost.post('/graphql').reply(200, () => ({ data: mockSchema }));

      const res = await Schema.downloadJSONSchema("http://some-dummy-host.com/graphql");
      expect(res.__schema.queryType.name).to.equal('Root');
    });
  });

  describe('#getSchema', () => {
    const graphHost = nock('http://some-dummy-host.com');

    it('should download a schema and make it executable', async () => {
      graphHost.post('/graphql').reply(200, () => ({ data: mockSchema }));

      const s = await Schema.getSchema("http://some-dummy-host.com/graphql")
      const x = JSON.parse(JSON.stringify(s));
      expect(x._queryType).to.equal("Root");
    });
  });

  describe('#jsonToGraphQL', () => {
    it('should be able to convert a json schema to a graphql idl schema', async () => {
      const jsonSchema = require('./samples/simple-schema.json');
      const output = Schema.jsonToGraphQL(jsonSchema);
      expect(output).to.contain('scalar Long');
      expect(output).to.contain('version: String');
    });
  });
});
