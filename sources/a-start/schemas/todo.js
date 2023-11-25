const todoTypeDefs = `#graphql
  type Todo {
    _id: ID!
    title: String!
    completed: Boolean!
    userId: ID!
  }

  input TodoCreateInput {
    userId: ID!
    title: String!
    completed: Boolean!
  }

  type Query {  
    todoList: TodoResponse
  }
  
  type Mutation {
    todoCreate(input: TodoCreateInput): TodoMutationResponse
    todoDelete(id: ID!): TodoMutationResponse
  }
`;

const todoResolvers = {
  Query: {
    todoList: () => {
      // TODO: Fetch data from models
      return {
        statusCode: 200,
        data: null,
      };
    },
  },
  Mutation: {
    todoCreate: (_, args) => {
      const { input } = args;
      const { userId, title, completed } = input;

      // TODO: Create data from models

      return {
        statusCode: 200,
        message: `Todo with id ${id} created successfully`,
      };
    },

    todoDelete: (_, args, contextValue) => {
      const { id } = args;

      // TODO: Delete data from models

      return {
        statusCode: 200,
        message: `Todo with id ${id} deleted successfully`,
      };
    },
  },
};

modules.exports = {
  todoTypeDefs,
  todoResolvers,
};
