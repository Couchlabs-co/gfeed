import { PutItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";
import { APIGatewayProxyEventV2 } from "aws-lambda";

interface Feedback {
  fullName: string;
  email: string;
  topic: string;
  feedback: string;
}

export const handler = ApiHandler(async (evt: APIGatewayProxyEventV2) => {
  console.log("evt time: ", evt.requestContext.time);
  const body: Feedback = JSON.parse(evt.body ?? '');

  if(!body || !body.fullName || !body.email || !body.topic || !body.feedback) {
    return {
      statusCode: 400,
      body: JSON.stringify({"msg": "Bad Request"})
    };
  }

  try {
    const { fullName, email, topic, feedback } = body;
    const feedbackTable = Table.feedback.tableName;
    const command: PutItemCommand = new PutItemCommand({
      TableName: feedbackTable,
      Item: {
        "email": { S: email },
        "created": { N: `${Date.now()}` },
        "fullName": { S: fullName },
        "topic": { S: topic },
        "feedback": { S: feedback },
      }
    });

    await dbClient.send(command);
    
    return {
      statusCode: 201,
      body: JSON.stringify({"msg": "Success"})
    };
  
  } catch (err) {
    console.log("err........", err);
    return {
      statusCode: 500,
      body: JSON.stringify({"err": "Something went wrong"})
    };
  }

});