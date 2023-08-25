import { SQSEvent } from "aws-lambda";
import { AttributeValue, DynamoDB, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";
import fetchRSSFeed from "./utils/fetchRssFeed";

const dynamoDb = new DynamoDB({
  region: "ap-southeast-2",
});

const formatItem = async (item: any, publisher: string) => {
  const feedItem: Record<any, AttributeValue> = {
    publishedDate: { S: new Date(item.pubDate).toISOString().split("T")[0] },
    title: { S: encodeURI(item.title) },
    link: { S: encodeURI(item.link) },
    pubDate: { N: new Date(item.pubDate).getTime().toString() },
    author: { S: item["dc:creator"] },
    guid: { S: encodeURI(item.guid) },
    description: { S: encodeURI(item.description) },
    category: { S: item.category?.join(",") ?? "" },
    publisher: { S: publisher },
  };
  return feedItem;
};

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
