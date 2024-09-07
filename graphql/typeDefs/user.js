const { gql } = require("apollo-server-express");

const userTypeDefs = gql`
  type User {
    name: String!
    email: String!
    password: String!
    posts: [Post]
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
  }

  type Query {
    usersGetAll: [User!]!
  }

  type Mutation {
    usersCreate(input: UserInput): User
    usersLogin(email: String!, password: String!): String
  }
`;

module.exports = userTypeDefs;
