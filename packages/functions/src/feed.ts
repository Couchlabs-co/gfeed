import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";

export const handler = ApiHandler(async (evt) => {
  console.log("evt time: ", evt.requestContext.time);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const keys = [yesterday.toISOString().split("T")[0], today.toISOString().split("T")[0]];

  const result = {
    Count: 0,
    Items: <any>[],
  };

  await Promise.all(
    keys.map(async (key) => {
      const command: QueryCommand = new QueryCommand({
        TableName: Table.article.tableName,
        KeyConditionExpression: "publishedDate = :publishedDate",
        ExpressionAttributeValues: {
          ":publishedDate": { S: key },
        },
        ConsistentRead: true,
      });
      let { Count, Items } = await dbClient.send(command);
      result.Count += Count ?? 0;
      result.Items = result.Items.concat(Items);
    })
  );

  const feedItems = <any>[];

  for (const item of result.Items) {
    feedItems.push({
      publishedDate: item.publishedDate.S,
      title: item.title.S && decodeURI(item.title.S),
      link: item.link.S && decodeURI(item.link.S),
      pubDate: item.pubDate.N,
      author: item.author.S,
      description: item.description.S && decodeURI(item.description.S),
      guid: item.guid.S && decodeURI(item.guid.S),
      publisher: item.publisher?.S,
      category: item.category?.S ?? "",
    });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ Count: result.Count, Items: feedItems }),
  };
});
