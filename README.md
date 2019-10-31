GraphQL Utils
=============

Installation
------------

    npm install -g git+https://github.com/bkulyk/graphql.utils.git


Usage
-----

### get-schema

    graphql-utils get-schema http://gdom.graphene-python.org/graphql > prod_schema.graphql


### validation-check

Check a given query for valiation errors.

#### usage

assuming you have a query in the file query.graphql

    graphql-utils validation-check prod_schema.graphql query.graphql

Sample output:

```
brokenQuery query has the following validation errors:

⯃  Field "episodeID" must not have a selection since type "Int" has no subfields.
   Locations: [{"line":5,"column":17}]

⯃  Cannot query field "field_does_not_exist" on type "Film".
   Locations: [{"line":10,"column":7}]

⯃  Field "speciesConnection" of type "FilmSpeciesConnection" must have a selection of subfields. Did you mean "speciesConnection { ... }"?
   Locations: [{"line":12,"column":7}]
```


### deprecation-check

check a given query for deprecation warnings

#### usage

assuming you have a query in the file query.graphql

    graphql-util deprecation-check prod_schema.graphql query.grahql

Sample output:

```
query speciesByFilm has the following deprecation warnings:

⯃  The field Film.species is deprecated. Test, use speciesConnection
    Locations: [{"line":7,"column":7}]

⯃  The field Film.planets is deprecated. Test, use planetConnection
    Locations: [{"line":8,"column":7}]
```


### check-query

check a given query for validation errors and deprecation warnings

#### usage

assuming you have a query in the file query.graphql

    graphql-util check-query prod_schema.graphql query.grahql
