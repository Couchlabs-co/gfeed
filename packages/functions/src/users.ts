import { AttributeValue, PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";
// import * as uuid from "uuid";
import { APIGatewayProxyEventV2 } from "aws-lambda";

export const handler = ApiHandler(async (evt: APIGatewayProxyEventV2) => {
  console.log("evt time: ", evt.requestContext.time);
  const {user} = JSON.parse(evt.body ?? '');

  if(!user || !user.authId) {
    return {
      statusCode: 400,
      body: JSON.stringify({"message": "Bad Request"})
    };
  }

  try {
    const [channel, authId] = user.authId.split('|');
    const userTable = Table.user.tableName;
    const userRecord: Record<string, AttributeValue> = {
      id: { S: authId },
      name: { S: user.name },
      email: { S: user.email },
      channel: { S: channel },
    };
    const command = new PutItemCommand({
      TableName: userTable,
      Item: userRecord,
      ReturnValues: "ALL_OLD",
    });

    const res = await dbClient.send(command);
    console.log("res........", res);
    return {
      statusCode: 201,
      body: JSON.stringify({"msg": "Success", "user": res})
    };
    
  } catch (err) {
    console.log("err........", err);
    return {
      statusCode: 500,
      body: JSON.stringify({"err": "Something went wrong"})
    };
  }

});