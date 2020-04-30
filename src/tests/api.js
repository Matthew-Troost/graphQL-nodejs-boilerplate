const axios = require('axios');
const API_URL = 'http://localhost:8000/graphql';

const user = async variables =>
    axios.post(API_URL, {
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

module.exports = {user}