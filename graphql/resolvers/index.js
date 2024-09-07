const userResolvers = require("./user");
const postResolvers = require("./post");
const commentResolvers = require("./comment")

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
    ...commentResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation
  },
};

module.exports = resolvers;
