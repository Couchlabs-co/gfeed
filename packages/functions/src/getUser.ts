import { AttributeValue, QueryCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";
import { APIGatewayProxyEventV2 } from "aws-lambda";

const getUser = async (id: string) => {
//   const userId = id.split("|");
  const userTable = Table.user.tableName;
  const userQuery = new QueryCommand({
    TableName: userTable,
    IndexName: "idIndex",
    KeyConditionExpression: "#id = :id",
    ExpressionAttributeNames: {
      "#id": "id",
    },
    ExpressionAttributeValues: {
      ":id": { S: id },
    },
    // ProjectionExpression: "id, name, email, channel, pic, createdAt",
});
    const res = await dbClient.send(userQuery);
    return res;

    // const userRecord: Record<string, AttributeValue> = {
    //   id: { S: userId.length > 1 ? userId[1] : userId[0] },
    //   name: { S: name },
    //   email: { S: email },
    //   channel: { S: channel },
    //   pic: { S: pic },
    //   createdAt: { S: new Date().toISOString() },
    // };
    // const command = new UpdateItemCommand({
    //   TableName: userTable,
    //   Key: {
    //     email: { S: email },
    //   },
    //   UpdateExpression: "set #id = :id, #name = :name, #channel = :channel, #pic = :pic, #createdAt = :createdAt",
    //   ExpressionAttributeNames: {
    //     "#id": "id",
    //     "#name": "name",
    //     "#channel": "channel",
    //     "#pic": "pic",
    //     "#createdAt": "createdAt",
    //   },
    //   ExpressionAttributeValues: {
    //     ":id": userRecord.id,
    //     ":name": userRecord.name, 
    //     ":channel": userRecord.channel,
    //     ":pic": userRecord.pic,
    //     ":createdAt": userRecord.createdAt,
    //   },
    //   ReturnValues: "ALL_NEW",
    // });

    // const res = await dbClient.send(command);
    // return res;
}

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
      const res = await getUser(user_id);
      return {
        statusCode: 200,
        body: JSON.stringify({"message": "Success", "user": res})
      }
    
  } catch (err) {
    console.log("err........", err);
    return {
      statusCode: 500,
      body: JSON.stringify({"err": "Something went wrong"})
    };
  }

});