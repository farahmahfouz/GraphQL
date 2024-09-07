const userTypeDefs = require("./user");
const postTypeDefs = require("./post");
const commentTypeDefs = require("./comment")

const typeDefs = [userTypeDefs, postTypeDefs, commentTypeDefs];

module.exports = typeDefs;
