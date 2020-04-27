const express = require('express');
require('dotenv/config');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { models, sequelize } = require('./graphql/models');

const app = express();

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');
    return {
      ...error,
      message,
    };
  },
  context: async () => ({ //this function is hit everytime a request is made to the server
    models,
    me: await models.User.findByLogin('rwieruch'),
    secret: process.env.SECRET,
  }),
});

server.applyMiddleware({ app, path: '/graphql' });

const eraseDatabaseOnSync = true; //this should only be true in development to spin up a fresh database

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    seedDatabase();
  }

  app.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
  });
});

const seedDatabase = async () => {
  await models.User.create(
    {
      username: 'rwieruch',
      email: 'hello@robin.com',
      password: 'rwieruch',
      messages: [
        {
          text: 'Published the Road to learn React',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
  await models.User.create(
    {
      username: 'ddavids',
      email: 'hello@david.com',
      password: 'ddavids',
      messages: [
        {
          text: 'Happy to release ...',
        },
        {
          text: 'Published a complete ...',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};