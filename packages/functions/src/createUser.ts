import { AttributeValue, PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";
// import * as uuid from "uuid";
import { APIGatewayProxyEventV2 } from "aws-lambda";

const createUser = async (id: string, name: string, email: string, channel: string, pic: string) => {
  const userId = id.split("|");
  const userTable = Table.user.tableName;
    const userRecord: Record<string, AttributeValue> = {
      id: { S: userId.length > 1 ? userId[1] : userId[0] },
      name: { S: name },
      email: { S: email },
      channel: { S: channel },
      pic: { S: pic },
      createdAt: { S: new Date().toISOString() },
    };
    const command = new UpdateItemCommand({
      TableName: userTable,
      Key: {
        email: { S: email },
      },
      UpdateExpression: "set #id = :id, #name = :name, #channel = :channel, #pic = :pic, #createdAt = :createdAt",
      ExpressionAttributeNames: {
        "#id": "id",
        "#name": "name",
        "#channel": "channel",
        "#pic": "pic",
        "#createdAt": "createdAt",
      },
      ExpressionAttributeValues: {
        ":id": userRecord.id,
        ":name": userRecord.name, 
        ":channel": userRecord.channel,
        ":pic": userRecord.pic,
        ":createdAt": userRecord.createdAt,
      },
      ReturnValues: "ALL_NEW",
    });

    const res = await dbClient.send(command);
    return res;
}

export const handler = ApiHandler(async (evt: APIGatewayProxyEventV2) => {
  console.log("evt time: ", evt.requestContext.time);

  if(!evt.headers["x-api-key"] || evt.headers["x-api-key"] !== process.env.X_API_KEY) {
    return {
      statusCode: 403,
      body: JSON.stringify({"message": "Unauthorised"})
    }
  }

  const {user} = JSON.parse(evt.body ?? '');

  if(!user || !user.email) {
    return {
      statusCode: 400,
      body: JSON.stringify({"message users": "Bad Request"})
    };
  }

  try {
    if(user.id){
      const res = await createUser(user.id, user.name, user.email, "google", user.image);
      return {
        statusCode: 201,
        body: JSON.stringify({"message": "Success", "user": res})
      }
    }

    const [channel, authId] = user.authId.split('|');
    const res = await createUser(authId, user.name, user.email, channel, user.image);

    return {
      statusCode: 201,
      body: JSON.stringify({"message": "Success", "user": res})
    };
    
  } catch (err) {
    console.log("err........", err);
    return {
      statusCode: 500,
      body: JSON.stringify({"err": "Something went wrong"})
    };
  }

});