import { GraphQLError } from "graphql";
import { getUserByEmail, getUserByUsername } from "../models/index.js";
import { generateToken } from "../utils/jwt.js";

const userTypeDefs = `#graphql
  type User {
    _id: ID!
    name: String!
    username: String!
    password: String!
    email: String!
  }

  type UserWithoutPassword {
    _id: ID!
    name: String!
    username: String!
    email: String!
  }

  type Query {
    userByEmail(email: String!): UserWithoutPasswordResponse 
    userLogin(username: String!, password: String!): UserLoginResponse
  }
`;
const userResolvers = {
	Query: {
		userByEmail: (_, args) => {
			const { email } = args;

			const user = getUserByEmail(email);

			return {
				statusCode: 200,
				data: user,
			};
		},

		userLogin: async (_, args, contextValue) => {
			const { username, password } = args;

			// contextValue.dummyFunction();
			const user = await getUserByUsername(username);

			// ?? Make logic for login here
			// !! In real apps, maybe the password is hashed and you need to compare it with the hashed password in the database
			// !! In this demo apps, we just compare the plain password as it is (unhashed)
			if (!user || user.password !== password) {
				throw new GraphQLError("Invalid username or password");
			}

			// Make the token here
			const payload = {
				id: user._id,
				email: user.email,
			};

			const token = generateToken(payload);

			return {
				// ! This is not an error, this is a success
				// ! Developer using wrong status code !
				statusCode: 501,
				data: {
					// Return the token
					token: token,
				},
			};
		},
	},
};

export { userTypeDefs, userResolvers };
