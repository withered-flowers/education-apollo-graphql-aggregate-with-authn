import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { getClientInstance } from "./config/db.js";
import { responseTypeDefs } from "./schemas/response.js";
import { todoResolvers, todoTypeDefs } from "./schemas/todo.js";
import { userResolvers, userTypeDefs } from "./schemas/user.js";

const server = new ApolloServer({
	typeDefs: [responseTypeDefs, userTypeDefs, todoTypeDefs],
	resolvers: [userResolvers, todoResolvers],
});

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
