const { gql } = require('apollo-server-koa');
const { User } = require('./db');

// 定义 GraphQL Schema
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Query {
    users: [User]
  }

  type Mutation {
    createUser(username: String!, email: String!): User
  }
`;

// 定义 Resolvers
const resolvers = {
  Query: {
    users: async () => await User.findAll(),
  },
  Mutation: {
    createUser: async (_, { username, email }) => {
      const user = await User.create({ username, email });
      return user;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
