const { getDb } = require("../config/db");
const { ObjectId } = require("mongodb");

const TODOS_COLLECTION = "Todos";
const USERS_COLLECTION = "Users";

const getTodos = async () => {
  const db = await getDb();
  // ?? Standard Query without aggregation lookup
  // const todos = await db.collection(TODOS_COLLECTION).find({}).toArray();

  // ?? Query with Aggregation Lookup
  const todos = await db
    .collection(TODOS_COLLECTION)
    .aggregate([
      // ?? We will aggregate lookup
      {
        // Remember this lookup will always result in array
        $lookup: {
          from: USERS_COLLECTION,
          localField: "userId",
          foreignField: "_id",
          as: "User",
        },
      },
      // ?? If you want to use "where", you can use $match
      // {
      //   $match: {
      //     completed: true,
      //   },
      // },
      // ?? If you want to filter the output, you can use $project
      {
        $project: {
          _id: 1,
          title: 1,
          completed: 1,
          userId: 1,
          // ?? Lookup value will always return array, so we need to use $arrayElemAt to get the first element
          // User: { $arrayElemAt: ["$User", 0] },
          // ?? Or we can use first
          User: { $first: "$User" },
        },
      },
    ])
    .toArray();

  console.log(JSON.stringify(todos, null, 2));

  return todos;
};

const createNewTodo = async (todo) => {
  const db = await getDb();

  // We need to modify todo.userId since this is an ObjectId instead of normal string
  if (todo && todo.userId) {
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
    }
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
