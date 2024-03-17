import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";
import { APIGatewayProxyEventV2 } from "aws-lambda";

type Bookmark = {
  userId: string;
  contentId: string;
  content: string;
  contentType: string;
  sk: number;
};

export const getBookmarks = async (userId: string) => {
  const bookmarkTable = Table.bigTable.tableName;
  const bookmarkQuery = new QueryCommand({
    TableName: bookmarkTable,
    KeyConditionExpression: "#userId = :userId",
    ExpressionAttributeNames: {
      "#userId": "userId",
    },
    ExpressionAttributeValues: {
      ":userId": { S: userId },
    },
  });

  const bookmarks: Bookmark[] = [];
    const res = await dbClient.send(bookmarkQuery);

    if(res.Count && res.Count > 0 && res.Items) {
      for(const bookmark of res.Items) {
        const { userId, contentId, content, contentType, sk } = bookmark;
        bookmarks.push({
          userId: userId.S!,
          contentId: contentId.S!,
          content: content.S!,
          contentType: contentType.S!,
          sk: Number(sk.N!),
        })
      }
    }
    return {
      Count: res.Count,
      Items: bookmarks,
    }

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
      const res = await getBookmarks(user_id);
      return {
        statusCode: 200,
        body: JSON.stringify({"message": "Success", "bookmarks": res})
      }
    
  } catch (err) {
    console.log("err........", err);
    return {
      statusCode: 500,
      body: JSON.stringify({"err": "Something went wrong"})
    };
  }

});