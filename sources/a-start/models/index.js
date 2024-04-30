const { getDb } = require("../config/db");
const { ObjectId } = require("mongodb");

const TODOS_COLLECTION = "Todos";
const USERS_COLLECTION = "Users";

const getTodos = async () => {
	const db = await getDb();
	const todos = await db.collection(TODOS_COLLECTION).find({}).toArray();

	return todos;
};

const createNewTodo = async (todo) => {
	const db = await getDb();

	// We need to modify todo.userId since this is an ObjectId instead of normal string
	if (todo?.userId) {
		todo.userId = new ObjectId(todo.userId);
	}

	const result = await db.collection(TODOS_COLLECTION).insertOne(todo);

	return result;
};

const destroyTodoById = async (id) => {
	const db = await getDb();
	const result = await db
		.collection(TODOS_COLLECTION)
		.deleteOne({ _id: new ObjectId(id) });

	return result;
};

const getUserByEmail = async (email) => {
	const db = await getDb();
	const result = await db.collection(USERS_COLLECTION).findOne(
		{ email },
		{
			projection: {
				password: 0,
			},
		},
	);

	return result;
};

const getUserByUsername = async (username) => {
	const db = await getDb();
	const result = await db.collection(USERS_COLLECTION).findOne({ username });

	return result;
};

module.exports = {
	getTodos,
	createNewTodo,
	destroyTodoById,
	getUserByEmail,
	getUserByUsername,
};
