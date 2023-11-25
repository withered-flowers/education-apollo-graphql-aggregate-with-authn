const { GraphQLError } = require("graphql");
const { getUserByEmail } = require("../models");

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

    userLogin: (_, args, contextValue) => {
      const { username, password } = args;

      contextValue.dummyFunction();

      // TODO: Make logic for login here
      throw new GraphQLError("Not implemented yet");

      return {
        statusCode: 501,
        data: {
          token: "not-implemented-yet",
        },
      };
    },
  },
};

module.exports = {
  userTypeDefs,
  userResolvers,
};
