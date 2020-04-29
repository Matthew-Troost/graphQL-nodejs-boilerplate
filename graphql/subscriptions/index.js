const { PubSub } = require('apollo-server');
const MESSAGE_EVENTS = require('./message');

module.exports = {
    pubsub: new PubSub(), EVENTS: {
        MESSAGE: MESSAGE_EVENTS,
    }
};