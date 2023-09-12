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
  const { athleteId, firstName, lastName, gender, age, grade, sport, number, position, state, school, rank, email, password } = req.body; // extracting athlete data
  if (typeof athleteId !== "string") { // Validating athlete data
    return res.status(400).json({ error: 'athleteId must be a string' });
  } else if (typeof firstName !== "string") {
    return res.status(400).json({ error: 'first name must be a string' });
  }

  if (typeof lastName !== "string") {
    return res.status(400).json({ error: " last name must be a string "});
  }

  if (typeof number !== "number") {
    return res.status(400).json({ error: "Jersey number must be a number"});
  }

  const params = {
    TableName: ATHLETES_TABLE,
    Item: {   //attributes
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

app.put("/athletes/:athleteId", async function (req, res) {
    const { athleteId } = req.params;
    const { firstName, lastName, gender, age, grade, sport, number, position, state, school, rank, email, password } = req.body;

    if (!athleteId || typeof athleteId !== "string") {
        return res.status(400).json({ error: '"athleteId" does not match' });
    }

    if ( !firstName || typeof firstName !== "string") { 
        return res.status(400).json({error: "firstName must be a string"})
    } 

    if ( !lastName || typeof lastName !== "string") {
        return res.status(400).json({ error: "lastName must be a string "})
    }

    if (!gender || typeof gender !== "string") {
        return res.status(400).json({ error: "gender must be a string"})
    }

    if ( !age || typeof age !== "number") {
        return res.status(400).json({ error: "Age must be a number"})
    }

    if ( !grade || typeof grade !== "string") {
        return res.status(400).json({ error: "grade must be a string"})
    }
    
    if ( !sport || typeof sport !== "string") {
        return res.status(400).json({ error: "sport must be a string"})
    }

    if ( !number || typeof number !== "number") {
        return res.status(400).json({ error: "number must be a number"})
    }

    if ( !position || typeof position !== "string") {
        return res.status(400).json({ error: "position must be a string"})
    }

    if ( !state || typeof state !== "string") {
        return res.status(400).json({ error: "state must be a string"})
    }

    if ( !school || typeof school !== "string") {
        return res.status(400).json({ error: "school must be a string"})
    }

    if ( !rank || typeof rank !== "number") {
        return res.status(400).json({ error: "rank must be a number"})
    }

    if ( !email || typeof email !== "string") {
        return res.status(400).json({ error: "email must be a string"})
    }

    if ( !password || typeof password !== "string") {
        return res.status(400).json({ error: "password must be a string"})
    }

    const params = {
        TableName: ATHLETES_TABLE,
        Key: {
            athleteId: athleteId,
        },
        
        updateExpression: "SET firstName = :firstName, lastName = :lastName, gender = :gender, age = :age, grade = :grade, sport = :sport, number = :number, position = :position, state = :state, school = :school, rank = :rank, email = :email, password = :password",

        ExpressionAttributeValues: {
            ":firstName": firstName, 
            ":lastName": lastName,
            ":gender": gender,
            ":age": age, 
            ":grade": grade,
            ":sport": sport, 
            ":number": number,
            ":position": position,
            ":state": state,
            ":school": school,
            ":rank": rank,
            ":email": email,
            ":password": password
        },
        ReturnValues: "ALL_NEW",
    };

    try {
        const { Attributes } = await dynamoDbClient.send(new PutCommand(params));
        res.json(Attributes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Could not update athlete" })
    }
})

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);
