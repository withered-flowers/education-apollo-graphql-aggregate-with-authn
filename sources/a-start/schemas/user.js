const userTypeDefs = `#graphql
  type User {
    _id: ID!
    name: String!
    username: String!
    password: String!
    email: String!
  }

  type Query {
    userByEmail(email: String!): UserResponse 
    userLogin(username: String!, password: String!): UserLoginResponse
  }
`;
const userResolvers = {
  Query: {
    userByEmail: (_, args) => {
      const { email } = args;

      // TODO: Fetch data from models

      return {
        statusCode: 200,
        data: null,
      };
    },

    userLogin: (_, args) => {
      const { username, password } = args;

      // TODO: Make logic for login here

      return {
        statusCode: 200,
        data: {
          token: "this-is-a-token",
        },
      };
    },
  },
};

modules.exports = {
  userTypeDefs,
  userResolvers,
};
