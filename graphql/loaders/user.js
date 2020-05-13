async function batchUsers(keys, models) {
  const users = await models.User.findAll({
    where: {
      id: keys,
    },
  });
  return keys.map((key) => users.find((user) => user.id === key) || new Error(`No result for ${key}`));
}

module.exports = batchUsers;
