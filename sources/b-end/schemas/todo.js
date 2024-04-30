const { getTodos, createNewTodo, destroyTodoById } = require("../models/index");

const todoTypeDefs = `#graphql
  type Todo {
    _id: ID!
    title: String!
    completed: Boolean!
    userId: ID!
  }

  # This is the Type Definition for "Relational" Todo with User
  type TodoAggregate {
    _id: ID!
    title: String!
    completed: Boolean!
    userId: ID!
    User: User
  }

  input TodoCreateInput {
    # Since the userId will be fetch from authentication
    # We can make it "just optional"
    userId: ID
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
		todoCreate: async (_, args, contextValue) => {
			// ?? We will use the authentication here
			// ?? Remember the doAuthentication will return { id, name }
			const { id: userId } = await contextValue.doAuthentication();

			const { input } = args;
			// ?? Since userId is declared via doAuthentication, we don't need to read it from input
			// const { userId, title, completed } = input;
			const { title, completed } = input;

			// ?? The rest is the same
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
