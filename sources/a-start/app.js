if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const { responseTypeDefs } = require("./schemas/response");
const { todoTypeDefs, todoResolvers } = require("./schemas/todo");
const { userTypeDefs, userResolvers } = require("./schemas/user");
const { getClientInstance } = require("./config/db");

const server = new ApolloServer({
  typeDefs: [responseTypeDefs, userTypeDefs, todoTypeDefs],
  resolvers: [userResolvers, todoResolvers],
});

(async () => {
  // Connect to database
  await getClientInstance();
  console.log("Database connected successfully");

  const { url } = await startStandaloneServer(server, {
    listen: 4000,
    context: async ({ req, res }) => {
      console.log("this console will be triggered on every request");

      return {
        dummyFunction: () => {
          console.log("We can read headers here", req.headers);
        },
      };
    },
  });

  console.log(`🚀 Server ready at ${url}`);
})();
