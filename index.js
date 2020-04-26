const express = require('express');
import 'dotenv/config';
const { ApolloServer } = require('apollo-server-express');
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { models, sequelize } = require('./graphql/models');

const app = express();

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models
  }
});

server.applyMiddleware({ app, path: '/graphql' });

sequelize.sync().then(async () => {
  app.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
  });
});
