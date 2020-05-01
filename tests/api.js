const axios = require('axios');

const API_URL = 'http://localhost:8000/graphql';

const signIn = async (variables) => axios.post(API_URL, {
  query: `
      mutation ($login: String!, $password: String!) {
        signIn(login: $login, password: $password) {
          token
        }
      }
    `,
  variables,
});

const deleteUser = async (variables, token) => axios.post(
  API_URL,
  {
    query: `
        mutation ($id: ID!) {
          deleteUser(id: $id)
        }
      `,
    variables,
  },
  {
    headers: {
      'x-token': token,
    },
  },
);

const getUser = async (variables) => axios.post(API_URL, {
  query: `
      query ($id: ID!) {
        user(id: $id) {
          id
          username
          email
        }
      }
    `,
  variables,
});

module.exports = { signIn, deleteUser, getUser };
