const { gql } = require('apollo-server-express');

//schema =  all the available data for reading and writing data via GraphQL.
const user = gql`
extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }
  
  #----- FIELDS -----
  type User {
    id: ID!
    username: String!
  }
`;

module.exports = user