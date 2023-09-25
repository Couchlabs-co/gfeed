import { dbClient } from "./utils/dbClient";
import { PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";

const feeds = [
    {
      "publisher": "Overreacted",
      "feedUrl": "https://overreacted.io/rss.xml",
      "feedStatus": "inactive",
      "feedType": "xml"
    },
    {
      "publisher": "A List Apart",
      "feedUrl": "https://alistapart.com/main/feed/",
      "feedStatus": "inactive",
      "feedType": "xml"
    },
    {
      "publisher": "Alice GG",
      "feedUrl": "https://alicegg.tech/feed.xml",
      "feedStatus": "active",
      "feedType": "xml"
    },
    {
      "publisher": "VentureBeat",
      "feedUrl": "http://feeds.feedburner.com/venturebeat/SZYF",
      "feedStatus": "active",
      "feedType": "xml"
    },
    {
      "publisher": "Joel on Software",
      "feedUrl": "https://www.joelonsoftware.com/feed/",
      "feedStatus": "active",
      "feedType": "xml"
    },
    {
      "publisher": "Sam Newman",
      "feedUrl": "https://samnewman.io/blog/feed.xml",
      "feedStatus": "active",
      "feedType": "xml"
    },
    {
      "publisher": "Mozilla Hacks",
      "feedUrl": "https://hacks.mozilla.org/feed/",
      "feedStatus": "active",
      "feedType": "xml"
    },
    {
      "publisher": "HACKERNOON",
      "feedUrl": "https://hackernoon.com/feed",
      "feedStatus": "active",
      "feedType": "xml"
    },
    {
      "publisher": "TechCrunch",
      "feedUrl": "https://www.techcrunch.com/feed",
      "feedStatus": "active",
      "feedType": "xml"
    },
    {
      "publisher": "Martin Fowler",
      "feedUrl": "https://martinfowler.com/feed.atom",
      "feedStatus": "active",
      "feedType": "atom"
    },
    {
      "publisher": "DAN NORTH",
      "feedUrl": "https://dannorth.net/blog/index.xml",
      "feedStatus": "active",
      "feedType": "xml"
    },
    {
      "publisher": "Coding Horror",
      "feedUrl": "https://blog.codinghorror.com/rss/",
      "feedStatus": "active",
      "feedType": "xml"
    }
  ];

export async function handler() {

    for (const feed of feeds) {
        const seedCommand = new PutItemCommand({
            TableName: Table.feed.tableName,
            Item: {
                publisher: { S: feed.publisher },
                feedUrl: { S: feed.feedUrl },
                feedType: { S: feed.feedType },
                feedStatus: { S: feed.feedStatus },
            },
        })
        await dbClient.send(seedCommand);
    }

  return {
    statusCode: 201,
    body: JSON.stringify({ status: "successful" }),
  };
}
