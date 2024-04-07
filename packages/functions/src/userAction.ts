import { PutItemCommand, DeleteItemCommand, AttributeValue } from "@aws-sdk/client-dynamodb";
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
    const BigOneTable = Table.bigTable.tableName;
    const { userId, content, contentType, reaction, contentLink, contentId } = body;

    const formattedContent = content.toLowerCase().split(' ').join('-').trim();

    const sk = `${formattedContent}#${reaction}`;
    
    if(['unfollow', 'delBookmark'].includes(reaction)) {
      const userAction = reaction === 'unfollow' ? 'follow' : 'bookmark';
      const sk = `${formattedContent}#${userAction}`;
      const command: DeleteItemCommand = new DeleteItemCommand({
        TableName: BigOneTable,
        Key: {
          pk: { S: `user#${userId}` },
          sk: { S: `${sk}` },
        },
      });

      const res = await dbClient.send(command);
      console.log("res for user action: ", contentId, reaction , res.$metadata.httpStatusCode);
      return {
        statusCode: res.$metadata.httpStatusCode,
        body: JSON.stringify({"msg": "Success"})
      };
    }

    let Item: Record<string, AttributeValue> = {
      pk: { S: `user#${userId}` }, // user#1234
      sk: { S: `${sk}`},
      ua: { S: reaction },
      ct: { S: content },
      ctt: { S: contentType },
    };

    if(contentType === 'post') {
      Item.cl ={ S: contentLink ?? '' };  // post link | interest link
      Item.cid ={ S: contentId }; // post id | interest id
    }

    if(contentType === 'feedAlgo') {
      Item.sk = { S: `feedAlgo#${reaction}` };
      Item.cid = { S: uuid.v4() };
    }

    Item.id ={ S: uuid.v4() };
    Item.cid ={ S: contentId }; // post id | interest id
    Item.cl ={ S: contentLink ?? '' }; // post link | interest link

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