const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const jwt = require("jsonwebtoken");
const secret = "yourSecretKey";

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Get the token from the headers
      const token = req.headers.authorization || "";
      console.log("🚀 ~ file: index.js:16 ~ startServer ~ token:", token);

      // Try to authenticate the user
      let user = null;
      if (token) {
        try {
          const decodedToken = jwt.verify(token.replace("Bearer ", ""), secret);
          user = decodedToken;
        } catch (err) {
          console.error("Invalid Token:", err);
        }
      }

      // Return the context with the user
      return { user };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  // Connect to MongoDB
  await mongoose.connect("mongodb://localhost:27017/graphqlDemo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.listen({ port: 4000 }, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
  });
}

startServer();
