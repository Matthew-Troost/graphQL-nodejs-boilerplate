const { combineResolvers } = require('graphql-resolvers');
const { isAuthenticated, isMessageOwner } = require('./authorization');

//resolver map
//each resolver has 4 arguments (parent, args, context, info). 
//Can inject dependencies for the resolver via context
const resolvers = {
    Query: {
        messages: async (parent, args, { models }) => {
            return await models.Message.findAll();
        },
        message: async (parent, { id }, { models }) => {
            return await models.Message.findByPk(id);
        },
    },
    Mutation: {
        createMessage: combineResolvers(
            isAuthenticated,
            async (parent, { text }, { models, me }) => {
                return await models.Message.create({
                    text,
                    userId: me.id,
                });
            },
        ),
        deleteMessage: combineResolvers(
            isAuthenticated,
            isMessageOwner,
            async (parent, { id }, { models }) => {
              return await models.Message.destroy({ where: { id } });
            },
          ),
    },

    //field level resolvers
    Message: {
        user: async (message, args, { models }) => {
            return await models.User.findByPk(message.userId);
        },
    },
};

module.exports = resolvers