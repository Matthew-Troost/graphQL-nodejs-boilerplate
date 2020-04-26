//resolver map
//each resolver has 4 arguments (parent, args, context, info). 
//Can inject dependencies for the resolver via context
const resolvers = {
    Query: {
        users: (parent, args, { models }) => {
            return Object.values(models.users);
        },
        user: (parent, { id }, { models }) => {
            return models.users[id];
        },
        me: () => {
            return me;
        },
    },
};

module.exports = resolvers