import { DynamoDB, QueryCommand, QueryInput } from "@aws-sdk/client-dynamodb";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";

const region = "ap-southeast-2";
const client = new DynamoDB({ region });

export const handler = ApiHandler(async (evt) => {
  console.log("evt time: ", evt.requestContext.time);
  const dt = new Date().toISOString().split("T")[0];
  console.log("evt time: ", dt);
  const command: QueryInput = {
    TableName: Table.item.tableName,
    KeyConditionExpression: "publishedDate = :publishedDate",
    ExpressionAttributeValues: {
      ":publishedDate": { S: "2023-08-24" },
    },
    ConsistentRead: true,
  };

  const { Count, Items } = await client.query(command);

  return {
    statusCode: 200,
    body: JSON.stringify({ Count, Items }),
  };
});
