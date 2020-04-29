const { gql } = require( 'apollo-server-express');

//schema =  all the available data for reading and writing data via GraphQL.
const user = gql`
extend type Query {
    messages: [Message!]!
    message(id: ID!): Message!
  }
  extend type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }

  #----- FIELDS -----
  type Message {
    id: ID!
    text: String!
    createdAt: Date!
    user: User!  #Use the whole entity rather than an identifier
  }
`;

module.exports = user