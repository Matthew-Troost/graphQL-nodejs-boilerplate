const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const models = require('./graphql/models');

const app = express();

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models
  }
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});