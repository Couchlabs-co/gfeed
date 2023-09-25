import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";

export const handler = ApiHandler(async (evt) => {
  console.log("evt time: ", evt.requestContext.time);
  
  const command: QueryCommand = new QueryCommand({
    TableName: Table.feed.tableName,
    KeyConditionExpression: "feedStatus = :feedStatus",
    ExpressionAttributeValues: {
        ":feedStatus": { S: 'active' },
    },
    ConsistentRead: true,
    });
  let { Count, Items } = await dbClient.send(command);

  const publishers = <any>[];

  if(Items && Items.length){
      for (const item of Items) {
        publishers.push({
            publisher: item.publisher.S,
            feedUrl: item.feedUrl.S,
            feedType: item.feedType.S,
        });
      }
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({ Count: 0, Items: [] }),
    };
  }


  return {
    statusCode: 200,
    body: JSON.stringify({ Count, Items: publishers }),
  };
});
