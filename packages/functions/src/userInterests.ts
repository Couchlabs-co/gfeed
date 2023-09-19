import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";
import { APIGatewayProxyEventV2 } from "aws-lambda";


export const handler = ApiHandler(async (evt: APIGatewayProxyEventV2) => {
  console.log("evt time: ", evt.requestContext.time);
  const user_id = evt.pathParameters?.userId;


  if(!user_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({"message": "Bad Request"})
    };
  }

  try {
    const userInterestsTable = Table.interests.tableName;
    const command: QueryCommand = new QueryCommand({
      TableName: userInterestsTable,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": { S: user_id },
      },
    });
    const res = await dbClient.send(command);
    return {
      statusCode: 201,
      body: JSON.stringify({"message": "Success", "data": res.Items})
    };
    
  } catch (err) {
    console.log("err........", err);
    return {
      statusCode: 500,
      body: JSON.stringify({"err": "Something went wrong"})
    };
  }

  
});