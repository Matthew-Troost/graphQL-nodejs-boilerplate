const uuidv4 = require('uuid/v4.js');

//resolver map
//each resolver has 4 arguments (parent, args, context, info). 
//Can inject dependencies for the resolver via context
const resolvers = {
    Query: {
        messages: (parent, args, { models }) => {
            return Object.values(models.messages);
        },
        message: (parent, { id }, { models }) => {
            return models.messages[id];
        },
    },
    Mutation: {
        createMessage: (parent, { text }, { models }) => {
            const id = uuidv4();
            const message = {
                id,
                text,
                userId: me.id,
            };
            models.messages[id] = message;

            return message;
        },
        deleteMessage: (parent, { id }, { models }) => {
            //destructuring - from the messeages object, 
            //it finds the message with the id provided. 
            //The rest of the messages are assigned to otherMessages
            const { [id]: message, ...otherMessages } = models.messages;
            if (!message) {
                return false;
            }

            models.messages = otherMessages;
            return true;
        },
    },

    //field level resolvers
    Message: {
        user: (message) => {
            return users[message.userId];
        },
    },
};

module.exports = resolvers