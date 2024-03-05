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
    const userActionsTable = Table.userActions.tableName;
    const { userId, content, contentType, reaction, contentLink, contentId } = body;

    const sk = `${content.toLocaleLowerCase().replace(' ', '-').trim()}#${reaction}`;
    
    if(reaction === 'unfollow') {
      const command: DeleteItemCommand = new DeleteItemCommand({
        TableName: userActionsTable,
        Key: {
          userId: { S: userId },
          sk: { S: `${content.toLocaleLowerCase().replace(' ', '-').trim()}#follow` },
        },
      });
      const res = await dbClient.send(command);
      return {
        statusCode: res.$metadata.httpStatusCode,
        body: JSON.stringify({"msg": "Success"})
      };
    }

    const Item = {
      id: { S: uuid.v4() },
      sk: { S: `${sk}`},
      userId: { S: userId },
      userAction: { S: reaction },
      content: { S: content },
      contentType: { S: contentType },
      contentId: { S: contentId },
      contentLink: { S: contentLink ?? '' },
    };
    const command: PutItemCommand = new PutItemCommand({
      TableName: userActionsTable,
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