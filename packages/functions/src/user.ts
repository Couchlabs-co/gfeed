import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";
import * as uuid from "uuid";
import { APIGatewayProxyEventV2 } from "aws-lambda";

interface UserAction {
  title: string;
  type: string;
  action: string;
  userId: string;
}

export const handler = ApiHandler(async (evt: APIGatewayProxyEventV2) => {
  console.log("evt time: ", evt.requestContext.time);
  const body: UserAction = JSON.parse(evt.body ?? '');

  if(!body || !body.title) {
    return {
      statusCode: 400,
      body: JSON.stringify({"msg": "Bad Request"})
    };
  }

  try {
    const userInterestsTable = Table.interests.tableName;
    const command: PutItemCommand = new PutItemCommand({
      TableName: userInterestsTable,
      Item: {
        id: { S: uuid.v4() },
        userId: { S: body?.userId },
        interest: { S: body?.title },
        type: { S: body?.type },
        action: { S: body?.action },
      },
    });
    const res = await dbClient.send(command);
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