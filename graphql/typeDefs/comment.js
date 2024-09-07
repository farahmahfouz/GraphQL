const { gql } = require("apollo-server-express");

const commentTypeDefs = gql`
  type Comment {
    content: String
    post: Post
  }
  type Query {
    getAllComment: [Comment]
  }
  type Mutation {
  createComment(content: String!, postId: ID!): String
  }
`;
module.exports = commentTypeDefs;