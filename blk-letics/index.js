const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand, 
  UpdateCommand, 
  ScanCommand
} = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");


const app = express();

const USERS_TABLE = process.env.USERS_TABLE;
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

app.get('/', function (req, res) {
  res.send('Hello World!')
})

// app.get("/users", async function (req, res) {

//   const params = {
//     TableName: USERS_TABLE,
//   }

//   try {
//     const { Users } = await dynamoDbClient.scan(params);

//     if (Users) {
//       res.json(Users);
//     } else {
//       res.status(404).json({ error: "No users found" });
//     }
//   } catch (error) {
//     console.error('Error getting users:', error)
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: 'Error getting users' }),
//     }
//   }
// });


app.get("/users/:userId", async function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      const { userId, name, university, department, title, email, password } = Item;
      res.json({ userId, name, university, department, title, email, password });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});

app.post("/users", async function (req, res) {
  const { userId, name, university, department, title, email, password } = req.body;
  if (typeof userId !== "string") {
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: userId,
      name: name,
      university: university,
      title: title, 
      email: email,
      password: password
    },
  };

  try {
    await dynamoDbClient.send(new PutCommand(params));
    res.json({ userId, name, university, department, title, email, password });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create user" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);
