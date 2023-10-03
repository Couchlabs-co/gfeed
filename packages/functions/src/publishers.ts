import { ScanCommand, ScanCommandOutput } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";

export const handler = ApiHandler(async (evt) => {
  console.log("evt time: ", evt.requestContext.time);
  
  const scanCommand: ScanCommand = new ScanCommand({
    TableName: Table.publisher.tableName,
    FilterExpression: "feedStatus = :feedStatus",
    ExpressionAttributeValues: {
        ":feedStatus": { S: 'active' },
    },
  });

  const {Count, Items}: ScanCommandOutput = await dbClient.send(scanCommand);

  const publishers = <any>[];

  if(Items && Items.length){
      for (const item of Items) {
        publishers.push({
            publisherId: item.id.S,
            name: item.publisherName.S,
            feedUrl: item.feedUrl.S,
            feedType: item.feedType.S,
            logo: item.logo?.S,
            primaryTags: item.primaryTags.S,
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
