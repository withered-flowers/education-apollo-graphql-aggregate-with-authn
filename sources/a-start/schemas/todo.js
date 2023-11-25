const { getTodos, createNewTodo, destroyTodoById } = require("../models/index");

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
    todoList: async () => {
      const todoList = await getTodos();

      return {
        statusCode: 200,
        data: todoList,
      };
    },
  },
  Mutation: {
    todoCreate: async (_, args) => {
      const { input } = args;
      const { userId, title, completed } = input;

      const todo = {
        userId,
        title,
        completed,
      };

      const result = await createNewTodo(todo);

      return {
        statusCode: 200,
        message: `Todo with id ${result.insertedId} created successfully`,
      };
    },

    todoDelete: async (_, args) => {
      const { id } = args;

      await destroyTodoById(id);

      return {
        statusCode: 200,
        message: `Todo with id ${id} deleted successfully`,
      };
    },
  },
};

module.exports = {
  todoTypeDefs,
  todoResolvers,
};
