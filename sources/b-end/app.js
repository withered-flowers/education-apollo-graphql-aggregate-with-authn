import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
// import { GraphQLError } from "graphql";

import { getClientInstance } from "./config/db.js";
import { responseTypeDefs } from "./schemas/response.js";
import { todoResolvers, todoTypeDefs } from "./schemas/todo.js";
import { userResolvers, userTypeDefs } from "./schemas/user.js";
// import { readPayload } from "./utils/jwt.js";
// import { getUserByEmail } from "./models";
import { authN } from "./utils/auth.js";

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

			// // We will make a new function to do authentication here
			// doAuthentication: async () => {
			//   const headerAuthorization = req.headers.authorization;

			//   if (!headerAuthorization) {
			//     throw new GraphQLError("You are not authenticated", {
			//       extensions: {
			//         http: "401",
			//         code: "UNAUTHENTICATED",
			//       },
			//     });
			//   }

			//   const token = headerAuthorization.split(" ")[1];

			//   // We need to read the token here
			//   const payload = readPayload(token);

			//   // We need to check if the user is exist in the database
			//   const user = await getUserByEmail(payload.email);

			//   if (!user) {
			//     throw new GraphQLError("You are not authenticated", {
			//       extensions: {
			//         http: "401",
			//         code: "UNAUTHENTICATED",
			//       },
			//     });
			//   }

			//   // We will give the additional data via return value (context)
			//   return {
			//     id: user._id,
			//     name: user.name,
			//   };
			// },

			// ?? We can also refactor the code above into a function and put in as helper (utils/auth.js -> authN)
			doAuthentication: async () => await authN(req),
		};
	},
});

console.log(`🚀 Server ready at ${url}`);
