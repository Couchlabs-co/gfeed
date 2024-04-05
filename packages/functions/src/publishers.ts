import { ScanCommand, ScanCommandOutput } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";

export const handler = ApiHandler(async (evt) => {
  console.log("evt time: ", evt.requestContext.time);
  const uniq = evt.queryStringParameters?.uniq;
  
  const scanCommand: ScanCommand = new ScanCommand({
    TableName: Table.publisher.tableName,
    FilterExpression: "feedStatus = :feedStatus",
    ExpressionAttributeValues: {
        ":feedStatus": { S: 'active' },
    },
  });

  const {Count, Items}: ScanCommandOutput = await dbClient.send(scanCommand);

  const publishers = <any>[];

  if(uniq === "true"){
    const uniqItems = Array.from([...new Set(Items?.map(item => item.publisherName.S))]);
    return {
          statusCode: 200,
          body: JSON.stringify({ Count: uniqItems.length, Items: uniqItems }),
        };
  }

  if(Items && Items.length){
      for (const item of Items) {
        publishers.push({
            publisherId: item.id.S,
            name: item.publisherName.S,
            feedUrl: item.feedUrl.S,
            feedType: item.feedType.S,
            logo: item.logo?.S,
            tag: item.primaryTag.S,
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
