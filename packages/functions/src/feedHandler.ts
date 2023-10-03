import { SQSEvent } from "aws-lambda";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { Table } from "sst/node/table";
import fetchRSSFeed from "./utils/fetchRssFeed";
import { formatItem } from "./utils/formatItem";
import { v4 } from "uuid";

export async function main(event: SQSEvent) {
  const tableName = Table.article.tableName;
  const records: any[] = event.Records;
  const { id: publisherId, publisher, feedUrl, tags } = JSON.parse(records[0].body);
  try {
    console.log(`starting to process feed: ${publisher} with url: ${feedUrl}`);

    const rssItems = await fetchRSSFeed(publisher, feedUrl);
    for (const item of rssItems) {
      const feedItem = await formatItem(item, publisher, tags);
      const putParams = new UpdateItemCommand({
        TableName: tableName,
        Key: {
          publishedDate: feedItem.publishedDate,
          guid: feedItem.guid,
        },
        UpdateExpression: "set #id = :id, #title = :title, #link = :link, #author = :author, #keywords = :keywords, #pubDate = :pubDate, #content = :content, #publisher = :publisher, #publisherId = :publisherId",
        ExpressionAttributeNames: {
          "#id": "id",
          "#title": "title",
          "#link": "link",
          "#author": "author",
          "#keywords": "keywords",
          "#pubDate": "pubDate",
          "#content": "content",
          "#publisher": "publisher",
          "#publisherId": "publisherId",
        },
        ExpressionAttributeValues: {
          ":id": { S: v4() },
          ":title": feedItem.title,
          ":link": feedItem.link,
          ":author": feedItem.author,
          ":keywords": feedItem.keywords,
          ":pubDate": feedItem.pubDate,
          ":content": feedItem.content,
          ":publisher": feedItem.publisher,
          ":publisherId": publisherId,
        },
        ReturnValues: "ALL_NEW",
      });
      await dbClient.send(putParams);
    }

    console.log(`Message processed: "${publisher}"`);

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "successful" }),
    };
  } catch (err) {
    console.log("err........", publisher, feedUrl, err);
  }
}
