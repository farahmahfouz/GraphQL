const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Post = require("./models/Post");
const secret = "mySecret";

// Sample GraphQL schema
const typeDefs = gql`
  type Post {
    title: String
    content: String
    user: User
  }
  type User {
    name: String!
    email: String!
    password: String!
    posts: [Post]
  }
  type Query {
    hello: String
    usersGetAll: [User!]!
    postGetAll: [Post]
  }
  input UserInput {
    name: String!
    email: String!
    password: String!
  }
  type Mutation {
    usersCreate(input: UserInput): User
    usersLogin(email: String!, password: String!): String
    postCreate(title: String!, content: String!, token: String!): String
  }
`;

const userQueries = {
  usersGetAll: async () => {
    const users = await User.find().populate("posts");
    return users;
  },
};
const userMutations = {
  usersCreate: async ({ input }) => {
    const { name, email, password } = input;
    const hashedPassword = await bcrypt.hash(password, 12);
    const createdUser = new User({ name, email, password: hashedPassword });
    await createdUser.save();
    return createdUser;
  },
  usersLogin: async ({ email, password }) => {
    const user = await User.findOne({ email });
    const isValidPassword = await bcrypt.compare(password, user?.password);
    if (!user || !isValidPassword) throw new Error("Invalid credentials");

    const token = jwt.sign({ userId: user._id }, secret);
    return token;
  },
};
const postQueries = {
  postGetAll: async () => {
    const posts = await Post.find().populate("user");
    return posts;
  },
};
const postMutations = {
  postCreate: async ({ title, content, token }) => {
    const { userId } = jwt.verify(token, secret);
    const user = await User.findById(userId);
    if (!user) throw new Error("Please login first");

    const createdPost = new Post({ title, content, user: user._id });
    await createdPost.save();
    return "Post created successfully";
  },
};

// Combine resolvers
const resolvers = {
  Query: {
    hello: () => "Hello World",
    ...userQueries,
    ...postQueries,
  },
  Mutation: {
    ...userMutations,
    ...postMutations,
  },
};

// Create Apollo Server
async function startApolloServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  server.applyMiddleware({ app });

  // Connect to MongoDB
  await mongoose.connect("mongodb://localhost:27017/graphqlDemo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Start the Express server
  app.listen({ port: 4000 }, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
  });
}

startApolloServer();
