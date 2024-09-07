const jwt = require("jsonwebtoken");
const Post = require("../../models/Post");
const User = require("../../models/User");
const secret = "yourSecretKey";

const postQueries = {
  postGetAll: async () => {
    const posts = await Post.find().populate("user");
    return posts;
  },
};

const postMutations = {
  postCreate: async (_, { title, content }, context) => {
    // Extract the authenticated user from the context
    const { user } = context;

    // Check if the user is authenticated
    if (!user) {
      throw new Error("Please login first");
    }

    // Find the user by their ID
    const foundUser = await User.findById(user.userId);
    if (!foundUser) {
      throw new Error("User not found");
    }

    // Create a new post with the user's ID
    const createdPost = new Post({
      title,
      content,
      user: foundUser._id,
    });

    // Save the new post
    await createdPost.save();

    return "Post created successfully";
  },
};

module.exports = {
  Query: postQueries,
  Mutation: postMutations,
};
