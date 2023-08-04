const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");


const app = express();

const ATHLETES_TABLE = process.env.ATHLETES_TABLE;
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(express.json());


app.get("/athletes/:athleteId", async function (req, res) {
  const params = {
    TableName: ATHLETES_TABLE,
    Key: {
      athleteId: req.params.athleteId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      const { athleteId, firstName, lastName, gender, age, grade, sport, number, position, state, school, rank, email, password } = Item;
      res.json({ athleteId, firstName, lastName, gender, age, grade, sport, number, position, state, school, rank, email, password });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find athlete with provided "athleteId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive athlete" });
  }
});

app.post("/athletes", async function (req, res) {
  const { athleteId, firstName, lastName, gender, age, grade, sport, number, position, state, school, rank, email, password } = req.body;
  if (typeof athleteId !== "string") {
    return res.status(400).json({ error: '"athleteId" must be a string' });
  } else if (typeof firstName !== "string") {
    return res.status(400).json({ error: '"firstName" must be a string' });
  }

  const params = {
    TableName: ATHLETES_TABLE,
    Item: {
      athleteId: athleteId,
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      age: age, 
      grade: grade,
      sport: sport, 
      number: number,
      position: position,
      state: state,
      school: school,
      rank: rank,
      email: email,
      password: password
    },
  };

  try {
    await dynamoDbClient.send(new PutCommand(params));
    res.json({ athleteId, firstName, lastName, gender, age, grade, sport, number, position, state, school, rank, email, password });
    console.log("DynamoDB Response:", response); //Logging the response from DynamoDB
  } catch (error) {
    console.log("DynamoDB Error:", error);
    res.status(500).json({ error: "Could not create athlete" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);
