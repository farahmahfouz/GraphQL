const { gql } = require("apollo-server-express");

const postTypeDefs = gql`
  type Post {
    title: String
    content: String
    user: User
  }

  type Query {
    postGetAll: [Post]
  }

  type Mutation {
    postCreate(title: String!, content: String!): String
  }
`;

module.exports = postTypeDefs;
