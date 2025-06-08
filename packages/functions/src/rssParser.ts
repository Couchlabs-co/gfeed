import { SQSEvent, SQSRecord } from "aws-lambda";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import {
  BatchWriteItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  WriteRequest,
} from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { Table } from "sst/node/table";
import fetchRSSFeed from "./utils/fetchRssFeed";
import { formatItem } from "./utils/formatItem";
import { Queue } from "sst/node/queue";
// import { parse } from "path";

const sqs = new SQSClient({
  region: "ap-southeast-2",
});

const filterItems = (publisher: string) => (arr: any[]) =>
  arr.filter((item: any) => {
    switch (publisher) {
      case "Damien Aicheh":
        return !item.link["@_href"].includes("-fr");
      case "Hacker News":
        return !(
          item.title?.includes("Show HN") || item.title?.includes("Ask HN")
        );
      case "TokyoDev":
        return !item.link["@_href"].includes("story-ja");
      case "Martin Fowler":
        return !item.title.includes("photostream ");
      case "Business Today":
        return !item.link.includes("issue");
      default:
        return item;
    }
  });

// function to create array of array of 25 items for a given array of items
async function saveBatchedItems(items: any[]) {
  let tempItems = [];
  const tableName = Table.bigTable.tableName;
  for (const item of items) {
    tempItems.push(item);
    if (tempItems.length === 25) {
      await dbClient.send(
        new BatchWriteItemCommand({
          RequestItems: {
            [tableName]: tempItems,
          },
        })
      );
      tempItems = [];
    }
  }
  if (tempItems.length > 0) {
    await dbClient.send(
      new BatchWriteItemCommand({
        RequestItems: {
          [tableName]: tempItems,
        },
      })
    );
    tempItems = [];
  }
  return;
}

export async function main(event: SQSEvent) {
  const records: SQSRecord[] = event.Records;
  let feedRssStatus = "success";
  console.log("length of records from queue: ", records.length);
  for (const record of records) {
    const startTime = Date.now();
    const {
      id: publisherId,
      publisher,
      feedUrl,
      tag,
      feedType,
      payWall,
    } = JSON.parse(record.body);
    if (feedType === "html") {
      console.log(`\n skipping html feed: ${publisher} with url: ${feedUrl}`);
      break;
    }
    try {
      console.log(
        `\n starting to process feed: ${publisher} with url: ${feedUrl} --- ${feedType}`
      );
      const rssItems = await fetchRSSFeed(publisher, feedUrl, feedType);
      // console.log(`\n fetched feed: ${publisher} with url: ${feedUrl} --- ${rssItems.length}`);
      let itemsMap = new Map<string, any>();
      const filterByPublisher = filterItems(publisher);

      const parsedItems: Record<string, any>[] = filterByPublisher(
        rssItems
      ).map((item: any) => formatItem(item, publisher, tag, payWall, feedUrl));

      for (const item of parsedItems) {
        if (!item || (!item.title && !item.description)) {
          console.log(
            `Skipping item with missing guid: ${JSON.stringify(item)}`
          );
          continue;
        }
        itemsMap.set(item.guid.S, item);
      }

      const batchedItems = Array.from(itemsMap.values()).map((item: any) => {
        return {
          PutRequest: {
            Item: {
              pk: { S: `post#${item.pk.S}` },
              sk: { S: `${item.sk.S}` },
              id: { S: `${item.id.S}` },
              title: { S: `${item.title.S}` },
              content: { S: `${item.content.S}` },
              author: { S: `${item.author.S}` },
              publisher: { S: `${item.publisher.S}` },
              link: { S: `${item.link.S}` },
              imgUrl: { S: `${item.img.S}` },
              keywords: { S: `${item.keywords.S}` },
              publisherId: { S: publisherId.S },
              pubDate: { N: `${item.pubDate.N}` },
              tag: { S: `${item.tag.S}` },
              guid: { S: `${item.guid.S}` },
              publishedDate: { S: `${item.publishedDate.S}` },
              payWall: { BOOL: item.payWall.BOOL ?? payWall },
            },
          },
        };
      });

      await saveBatchedItems(batchedItems);
      console.log(`Message processed: ${publisher} with url: ${feedUrl}`);
      const endTime = Date.now();
      const timeTaken = endTime - startTime;
      console.log(`total time taken: ${timeTaken}`);
      await updateRSSPublisherPulledTime(
        publisher,
        feedUrl,
        timeTaken,
        "success"
      );

      //if publisher is TechCrunch and image is not present, add to media queue
      for (const item of parsedItems) {
        if (item.publisher.S === "TechCrunch" && item.img.S === "") {
          await addToMediaQueue(item, publisherId);
        }
      }
    } catch (err) {
      console.log("rssParser err........", err);
      feedRssStatus = "failed";
      await updateRSSPublisherPulledTime(publisher, feedUrl, 0, feedRssStatus);
      // // await ItemToDeadLetterQ(item);
      break;
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ status: "successful" }),
  };
}

// async function ItemToDeadLetterQ(item: any) {
//   const params = {
//     MessageBody: JSON.stringify(item),
//     QueueUrl: Queue.PostDLQ.queueUrl,
//   };
//   await sqs.send(new SendMessageCommand(params));
//   console.log("Sent message to queue", params);
// }

// function to update lastPulled time and time take for the feed
async function updateRSSPublisherPulledTime(
  publisher: String,
  feedUrl: String,
  timeTaken: number,
  status: String
) {
  const updateQuery = new UpdateItemCommand({
    TableName: Table.publisher.tableName,
    Key: {
      publisherName: { S: `${publisher}` },
      feedUrl: { S: `${feedUrl}` },
    },
    UpdateExpression:
      "set lastCrawled = :t, timeTaken = :tt, crawledStatus = :s",
    ExpressionAttributeValues: {
      ":t": { S: new Date().toISOString() },
      ":tt": { N: `${timeTaken}` },
      ":s": { S: `${status}` },
    },
  });
  await dbClient.send(updateQuery);
  console.log("updated lastCrawled time for publisher: ", publisher);
}

async function addToMediaQueue(
  feedItem: Record<any, import("@aws-sdk/client-dynamodb").AttributeValue>,
  publisherId: String
) {
  const params = {
    MessageBody: JSON.stringify({ feedItem, publisherId }),
    QueueUrl: Queue.ImageQueue.queueUrl,
  };
  await sqs.send(new SendMessageCommand(params));
  console.log("Sent message to image queue", feedItem.link.S);
}
