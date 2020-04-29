const { gql } = require('apollo-server-express');

//schema =  all the available data for reading and writing data via GraphQL.
const user = gql`
extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User,
    role: String
  }

  extend type Mutation {
    signUp(
      username: String!
      email: String!
      password: String!
    ): Token!
    
    signIn(login: String!, password: String!): Token!

    deleteUser(id: ID!): Boolean!
  }

  #----- FIELDS -----
  type Token {
    token: String!
  }
  
  type User {
    id: ID!
    username: String!
    email: String!
    messages: [Message!]
  }
`;

module.exports = user