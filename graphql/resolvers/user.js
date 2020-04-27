const jwt = require('jsonwebtoken');
const { AuthenticationError, UserInputError } = require('apollo-server');

//resolver map
//each resolver has 4 arguments (parent, args, context, info). 
//Can inject dependencies for the resolver via context
const resolvers = {
  Query: {
    users: async (parent, args, { models }) => {
      return await models.User.findAll();
    },
    user: async (parent, { id }, { models }) => {
      return await models.User.findByPk(id);
    },
    me: async (parent, args, { models, me }) => {
      return await models.User.findByPk(me.id);
    },
  },

  Mutation: {
    signUp: async (
      parent,
      { username, email, password },
      { models, secret },
    ) => {
      const user = await models.User.create({
        username,
        email,
        password,
      });
      return { token: createToken(user, secret, '30m') };
    },

    signIn: async (
      parent,
      { login, password },
      { models, secret },
    ) => {
      const user = await models.User.findByLogin(login); //login is either username or password
      if (!user) {
        throw new UserInputError(
          'No user found with these login credentials.',
        );
      }
      const isValid = await user.validatePassword(password);
      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }
      return { token: createToken(user, secret, '30m') };
    },
  },

  User: {
    messages: async (user, args, { models }) => {
      return await models.Message.findAll({
        where: {
          userId: user.id,
        },
      });
    },
  },
};

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username } = user;
  return await jwt.sign({ id, email, username }, secret, {
    expiresIn,
  });
};

module.exports = resolvers