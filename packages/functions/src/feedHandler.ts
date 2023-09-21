import { SQSEvent } from "aws-lambda";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { Table } from "sst/node/table";
import fetchRSSFeed from "./utils/fetchRssFeed";
import { formatItem } from "./utils/formatItem";

export async function main(event: SQSEvent) {
  try {
    const tableName = Table.article.tableName;
    const records: any[] = event.Records;
    const { publisher, feedUrl } = JSON.parse(records[0].body);

    const rssItems = await fetchRSSFeed(publisher, feedUrl);
    for (const item of rssItems) {
      const feedItem = await formatItem(item, publisher);
      const putParams = new UpdateItemCommand({
        TableName: tableName,
        Key: {
          publishedDate: feedItem.publishedDate,
          guid: feedItem.guid,
        },
        UpdateExpression: "set #title = :title, #link = :link, #author = :author, #keywords = :keywords, #pubDate = :pubDate, #content = :content, #publisher = :publisher",
        ExpressionAttributeNames: {
          "#title": "title",
          "#link": "link",
          "#author": "author",
          "#keywords": "keywords",
          "#pubDate": "pubDate",
          "#content": "content",
          "#publisher": "publisher",
        },
        ExpressionAttributeValues: {
          ":title": feedItem.title,
          ":link": feedItem.link,
          ":author": feedItem.author,
          ":keywords": feedItem.keywords,
          ":pubDate": feedItem.pubDate,
          ":content": feedItem.content,
          ":publisher": feedItem.publisher,
        },
        ReturnValues: "ALL_NEW",
      });
      await dbClient.send(putParams);
    }

    console.log(`Message processed: "${records.length}"`);

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "successful" }),
    };
  } catch (err) {
    console.log("err........", err);
  }
}
