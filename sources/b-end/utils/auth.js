const { GraphQLError } = require("graphql");
const { readPayload } = require("../utils/jwt");
const { getUserByEmail } = require("../models");

const authN = async (req) => {
  const headerAuthorization = req.headers.authorization;

  if (!headerAuthorization) {
    throw new GraphQLError("You are not authenticated", {
      extensions: {
        http: "401",
        code: "UNAUTHENTICATED",
      },
    });
  }

  const token = headerAuthorization.split(" ")[1];

  // We need to read the token here
  const payload = readPayload(token);

  // We need to check if the user is exist in the database
  const user = await getUserByEmail(payload.email);

  if (!user) {
    throw new GraphQLError("You are not authenticated", {
      extensions: {
        http: "401",
        code: "UNAUTHENTICATED",
      },
    });
  }

  // We will give the additional data via return value (context)
  return {
    id: user._id,
    name: user.name,
  };
};

module.exports = authN;
