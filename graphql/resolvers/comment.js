const Comment = require("../../models/Comment");
const Post = require("../../models/Post");
const User = require("../../models/User");

const commentQueries = {
  getAllComment: async () => {
    const comments = await Comment.find().populate("post");
    return comments;
  },
};

const commentMutations = {
  createComment: async (_, { content, postId }, context) => {
    const { user } = context;

    if (!user) {
      throw new Error("User Not Found");
    }

    const foundPost = await Post.findById(postId);
    if (!foundPost) {
      throw new Error("Post Not Found");
    }

    const createComment = new Comment({
      content,
      post: foundPost._id,
    });

    await createComment.save();
    return "Comment created successfully";
  },
};

module.exports = {
    Query: commentQueries,
    Mutation: commentMutations,
  };
  