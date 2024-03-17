import { PutItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";
import * as uuid from "uuid";
import { APIGatewayProxyEventV2 } from "aws-lambda";

interface UserAction {
  content: string;
  contentType: string;
  reaction: string;
  userId: string;
  contentLink: string;
  contentId: string;
}

export const handler = ApiHandler(async (evt: APIGatewayProxyEventV2) => {
  console.log("evt time: ", evt.requestContext.time);
  const body: UserAction = JSON.parse(evt.body ?? '');

  if(!body || !body.content) {
    return {
      statusCode: 400,
      body: JSON.stringify({"msg": "Bad Request"})
    };
  }

  try {
    // const BigOneTable = Table.userActions.tableName;
    const BigOneTable = Table.bigTable.tableName;
    const { userId, content, contentType, reaction, contentLink, contentId } = body;

    const formattedContent = content.toLowerCase().split(' ').join('-').trim();

    const sk = `${formattedContent}#${reaction}`;
    
    if(reaction === 'unfollow') {
      const command: DeleteItemCommand = new DeleteItemCommand({
        TableName: BigOneTable,
        Key: {
          pk: { S: `user#${userId}` },
          sk: { S: `${formattedContent}#follow` },
        },
      });
      const res = await dbClient.send(command);
      return {
        statusCode: res.$metadata.httpStatusCode,
        body: JSON.stringify({"msg": "Success"})
      };
    }

    const Item = {
      pk: { S: `user#${userId}` }, // user#1234
      sk: { S: `${sk}`}, // 
      id: { S: uuid.v4() },
      ua: { S: reaction }, // follow | like | dislike | view | bookmark
      ct: { S: content }, // post title | interest name
      ctt: { S: contentType }, // interest | post | algorithm
      cid: { S: contentId }, // post id | interest id
      cl: { S: contentLink ?? '' },  // post link | interest link
    };
    const command: PutItemCommand = new PutItemCommand({
      TableName: BigOneTable,
      Item: Item,
    });
    const res = await dbClient.send(command);
    return {
      statusCode: res.$metadata.httpStatusCode,
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