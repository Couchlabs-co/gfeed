import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";
import * as uuid from "uuid";
import { APIGatewayProxyEventV2 } from "aws-lambda";

const createUser = async (id: string, name: string, email: string, channel: string, pic: string) => {
  const userTable = Table.bigTable.tableName;

    const userCommand = new PutItemCommand({
      TableName: userTable,
      Item: {
        pk: { S: `user#${id}` },
        sk: { S: `info` },
        name: { S: name },
        email: { S: email },
        channel: { S: channel },
        pic: { S: pic ?? '' },
        type: { S: 'USER' },
        createdAt: { S: new Date().toISOString() },
      },
    });

    const userFeedAlgoCommand = new PutItemCommand({
          TableName: userTable,
          Item: {
            pk: { S: `user#${id}` },
            sk: { S: `feedAlgo#selected` },
            cid: { S: uuid.v4() },
            ua: { S: 'selected' }, // follow | like | dislike | view | bookmark
            ct: { S: 'timeBased' }, // post title | interest name
            ctt: { S: 'feedAlgo' }, // interest | post | algorithm
          },
        });

    const res = await dbClient.send(userCommand);
    await dbClient.send(userFeedAlgoCommand);
    return res;
}

export const handler = ApiHandler(async (evt: APIGatewayProxyEventV2) => {
  console.log("evt time: ", evt.requestContext.time);
  console.log("evt headers: ", evt.headers["x-api-key"], process.env.USER_API_KEY);


  if(!evt.headers["x-api-key"] || evt.headers["x-api-key"] !== process.env.USER_API_KEY) {
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