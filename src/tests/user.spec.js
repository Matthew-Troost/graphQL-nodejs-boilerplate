const { expect } = require('chai');
const { user } = require('./api');

describe('users', () => {
  describe('user(id: String!): User', () => {
    it('returns a user when user can be found', async () => {
      const expectedResult = {
        data: {
          user: {
            id: '1',
            username: 'rwieruch',
            email: 'hello@robin.com',
          },
        },
      };
      const result = await user({ id: '1' });
      expect(result.data).to.eql(expectedResult);
    });
  });
});