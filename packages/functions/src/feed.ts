import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";

export const handler = ApiHandler(async (evt) => {
  console.log("evt time: ", evt.requestContext.time);
  const dt = new Date().toISOString().split("T")[0];
  console.log("evt time: ", dt);
  const command: QueryCommand = new QueryCommand({
    TableName: Table.item.tableName,
    KeyConditionExpression: "publishedDate = :publishedDate",
    ExpressionAttributeValues: {
      ":publishedDate": { S: dt },
    },
    ConsistentRead: true,
  });

  const { Count, Items } = await dbClient.send(command);
  if (!Items) {
    return {
      statusCode: 200,
      body: JSON.stringify({ Count: 0, Items: [] }),
    };
  }

  const feedItems = [];

  for (const item of Items) {
    feedItems.push({
      publishedDate: item.publishedDate.S,
      title: item.title.S && decodeURI(item.title.S),
      link: item.link.S && decodeURI(item.link.S),
      pubDate: item.pubDate.N,
      author: item.author.S,
      description: item.description.S && decodeURI(item.description.S),
      guid: item.guid.S && decodeURI(item.guid.S),
      publisher: item.publisher.S,
      category: item.category?.S ?? "",
    });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ Count, Items: feedItems }),
  };
});
