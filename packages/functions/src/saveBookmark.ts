import { PutItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";
import * as uuid from "uuid";
import { APIGatewayProxyEventV2 } from "aws-lambda";

interface BookmarkAction {
  content: string;
  contentType: string;
  reaction: string;
  userId: string;
  contentId: string;
  contentLink: string;
}

export const handler = ApiHandler(async (evt: APIGatewayProxyEventV2) => {
  console.log("evt time: ", evt.requestContext.time);
  const body: BookmarkAction = JSON.parse(evt.body ?? '');

  if(!body || !body.contentId) {
    return {
      statusCode: 400,
      body: JSON.stringify({"msg": "Bad Request"})
    };
  }

  try {
    const { userId, content, contentType, contentId, reaction } = body;
    const bookmarkTable = Table.bookmark.tableName;
    if(reaction === 'save'){
      const command: PutItemCommand = new PutItemCommand({
        TableName: bookmarkTable,
        Item: {
          id: { S: uuid.v4() },
          sk: { N: Date.now().toFixed(0) },
          userId: { S: userId },
          content: { S: content },
          contentType: { S: contentType },
          contentId: { S: contentId },
          contentLink: { S: body.contentLink },
        },
      });
      const res = await dbClient.send(command);
      return {
        statusCode: 201,
        body: JSON.stringify({"msg": "Success"})
      };
    }

    if(reaction === 'delete'){
      const command = new DeleteItemCommand({
        TableName: bookmarkTable,
        Key: {
          userId: { S: userId },
          contentId: { S: contentId },
        },
      });
      const res = await dbClient.send(command);
      return {
        statusCode: 400,
        body: JSON.stringify({"msg": "Bad Request"})
      };
    }
    
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