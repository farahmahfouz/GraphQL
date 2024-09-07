const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

// Sample GraphQL schema
const typeDefs = gql`
  type Query {
    hello: String
  }



  type Mutation {
  }
`;

// Sample resolvers
const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
  Mutation: {},
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

  // Start the Express server
  app.listen({ port: 4000 }, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
  });
}

startApolloServer();
