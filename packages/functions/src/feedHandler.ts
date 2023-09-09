import { SQSEvent } from "aws-lambda";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { Table } from "sst/node/table";
import fetchRSSFeed from "./utils/fetchRssFeed";
import { formatItem } from "./utils/formatItem";

export async function main(event: SQSEvent) {
  try {
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
      await dbClient.send(putParams);
    }

    console.log(`Message processed: "${records[0].body}"`);

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "successful" }),
    };
  } catch (err) {
    console.log("err........", err);
  }
}
