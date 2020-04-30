require('dotenv/config');
const express = require('express');
const http = require('http');
const jwt = require('jsonwebtoken');
const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { models, sequelize } = require('./graphql/models');

const app = express();

const getMe = async req => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};

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
  context: async ({ req, connection }) => { //this function is hit everytime a request is made to the server 
    if (connection) {
      return {
        models,
      };
    }

    if (req) {
      const me = await getMe(req); //this still allows request with no token. Only throws error if token is invalid or expired
      return {
        models,
        me,
        secret: process.env.SECRET,
      };
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const isTest = !!process.env.TEST_DATABASE;

sequelize.sync({ force: isTest }).then(async () => {
  if (isTest) {
    seedDatabase();
  }

  httpServer.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
  });
});

const seedDatabase = async () => {
  await models.User.create(
    {
      username: 'rwieruch',
      email: 'hello@robin.com',
      password: 'rwieruch',
      role: 'ADMIN',
      messages: [
        {
          text: 'Published the Road to learn React',
          createdAt: new Date()
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
          createdAt: new Date()
        },
        {
          text: 'Published a complete ...',
          createdAt: new Date()
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};