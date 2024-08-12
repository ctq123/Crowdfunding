const { gql } = require('apollo-server-koa');

// 定义 GraphQL Schema
const typeDefs = gql`  
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type History {
    id: ID!
    address: String!
    price: Float!
    tx: String!
    blockNo: Int!
    crowdId: Int!
  }

  type Query {
    users: [User],
    historys: [History],
    getHistories: [History]
  }

  type Mutation {
    createUser(username: String!, email: String!): User
    createHistory(address: String!, price: Float!, tx: String!, blockNo: Int!, crowdId: Int!): History
  }
`;

module.exports = {
  typeDefs,
};
