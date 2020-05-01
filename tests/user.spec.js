/* eslint-disable no-undef */
const { expect } = require('chai');
const { signIn, deleteUser, getUser } = require('./api');

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
      const result = await getUser({ id: '1' });
      expect(result.data).to.eql(expectedResult);
    });

    it('returns null when user cannot be found', async () => {
      const expectedResult = {
        data: {
          user: null,
        },
      };
      const result = await getUser({ id: '42' });
      expect(result.data).to.eql(expectedResult);
    });
  });

  describe('deleteUser(id: String!): Boolean!', () => {
    it('returns an error because only admins can delete a user', async () => {
      const {
        data: {
          data: {
            signIn: { token },
          },
        },
      } = await signIn({
        login: 'ddavids',
        password: 'ddavids',
      });
      const {
        data: { errors },
      } = await deleteUser({ id: '1' }, token);
      expect(errors[0].message).to.eql('Not authorized as admin.');
    });
  });
});
