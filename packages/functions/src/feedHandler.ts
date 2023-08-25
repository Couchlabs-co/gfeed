import { SQSEvent } from "aws-lambda";
import { AttributeValue, DynamoDB, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";
import fetchRSSFeed from "./utils/fetchRssFeed";
import { formatItem } from "./utils/formatItem";

const dynamoDb = new DynamoDB({
  region: "ap-southeast-2",
});

export async function main(event: SQSEvent) {
  const itemTableName = Table.item.tableName;
  const records: any[] = event.Records;
  const { publisher, feedUrl } = JSON.parse(records[0].body);

  const rssItems = await fetchRSSFeed(publisher, feedUrl);
  for (const item of rssItems) {
    const feedItem = await formatItem(item, publisher);
    const putParams = new PutItemCommand({
      TableName: itemTableName,
      Item: { ...feedItem },
    });
    await dynamoDb.send(putParams);
  }

  console.log(`Message processed: "${records[0].body}"`);

  return {
    statusCode: 200,
    body: JSON.stringify({ status: "successful" }),
  };
}
