import { ScanCommand, ScanCommandOutput } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";

export const handler = ApiHandler(async (evt) => {
  console.log("evt time: ", evt.requestContext.time);
  
  const scanCommand: ScanCommand = new ScanCommand({
    TableName: Table.interests.tableName,
    ProjectionExpression: "id, interestName",
  });

  const {Count, Items}: ScanCommandOutput = await dbClient.send(scanCommand);

  const interests = <any>[];

  if(Items && Items.length){
      for (const item of Items) {
        interests.push({
            interestId: item.id.S,
            tagName: item.interestName.S,
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
    body: JSON.stringify({ Count, Items: interests }),
  };
});
