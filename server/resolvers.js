const { User, History } = require('./db');

// 定义 Resolvers
const resolvers = {
  Query: {
    users: async () => await User.findAll(),
    historys: async () => await History.findAll(),
  },
  Mutation: {
    createUser: async (_, { username, email }) => {
      const user = await User.create({ username, email });
      return user;
    },
    createHistory: async (_, { address, price, tx, blockNo, crowdId }) => {
      const history = await History.create({ address, price, tx, blockNo, crowdId });
      return history;
    },
  },
};

module.exports = {
  resolvers,
};
