import { SQSEvent } from "aws-lambda";
import { AttributeValue, DynamoDB, PutItemCommand } from "@aws-sdk/client-dynamodb";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB({
  region: "ap-southeast-2",
});

const formatItem = async (item: any, publisher: string) => {
  const feedItem: Record<any, AttributeValue> = {
    id: { S: `${item.title}-${item.link}` },
    title: { S: item.title },
    link: { S: item.link },
    pubDate: { N: new Date(item.pubDate).getTime().toString() },
    author: { S: item["dc:creator"] },
    guid: { S: item.guid },
    description: { S: item.description },
    category: { S: item.category.join(",") },
  };
  return feedItem;
};

export async function main(event: SQSEvent) {
  const itemTableName = Table.item.tableName;
  const records: any[] = event.Records;
  const { feedUrl } = JSON.parse(records[0].body);
  const response = await axios.get(feedUrl);

  const parser = new XMLParser();
  let jObj = parser.parse(response.data);
  const rssItems = jObj.rss.channel.item;
  for (const item of rssItems) {
    const feedItem = await formatItem(item, jObj.rss.channel.title);
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
