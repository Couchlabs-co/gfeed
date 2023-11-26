import { SQSEvent, SQSRecord } from "aws-lambda";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { Table } from "sst/node/table";
import fetchRSSFeed from "./utils/fetchRssFeed";
import { formatItem } from "./utils/formatItem";
import { v4 } from "uuid";

export async function main(event: SQSEvent) {
  const tableName = Table.posts.tableName;
  const records: SQSRecord[] = event.Records;
  for(const record of records){
    const { id: publisherId, publisher, feedUrl, tag, feedType } = JSON.parse(record.body);
    if(feedType === 'html') {
      console.log(`skipping html feed: ${publisher} with url: ${feedUrl}`);
      break;
    }
    console.log(`starting to process feed: ${publisher} with url: ${feedUrl}`);
    const rssItems = await fetchRSSFeed(publisher, feedUrl);
    for (const item of rssItems) {
      try {
        const feedItem = await formatItem(item, publisher, tag);
        if(publisher === 'Hacker News' && feedItem.title.S?.includes('Show HN')) {
          continue;
        }
        await SaveItem(tableName, feedItem, publisherId);
      } catch (err) {
        console.log("err........", publisher, feedUrl, err, item.title);
      }
    }
    console.log(`Message processed: "${publisher}"`);
  }
    
  return {
    statusCode: 200,
    body: JSON.stringify({ status: "successful" }),
  };
}
async function SaveItem(tableName: string, feedItem: any, publisherId: any) {
  const putParams = new UpdateItemCommand({
    TableName: tableName,
    Key: {
      publishedDate: feedItem.publishedDate,
      guid: feedItem.guid,
    },
    UpdateExpression: "set #id = :id, #title = :title, #link = :link, #author = :author, #keywords = :keywords, #pubDate = :pubDate, #content = :content, #publisher = :publisher, #publisherId = :publisherId, #img = :img, #tag = :tag",
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
      "#tag": "tag",
      "#img": "img",
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
      ":tag": feedItem.tag,
      ":img": feedItem.img ?? '',
    },
    ReturnValues: "ALL_NEW",
  });
  await dbClient.send(putParams);
}

