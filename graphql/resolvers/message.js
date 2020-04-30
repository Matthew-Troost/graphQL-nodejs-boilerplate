const { combineResolvers } = require('graphql-resolvers');
const { isAuthenticated, isMessageOwner } = require('./authorization');
const { pubsub, EVENTS } = require('../subscriptions');

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
                const message = await models.Message.create({
                    text,
                    userId: me.id,
                });
                pubsub.publish(EVENTS.MESSAGE.CREATED, {
                    messageCreated: { message },
                });
                return message;
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
    Subscription: {
        messageCreated: {
            subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
        },
    },

    //field level resolvers
    Message: {
        user: async (message, args, { loaders }) => {
            return await loaders.user.load(message.userId);
        },
    },
};

module.exports = resolvers