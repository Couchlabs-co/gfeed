import { dbClient } from "./utils/dbClient";
import { PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";

const feeds = [
    {
      "publisher": "Overreacted",
      "feedUrl": "https://overreacted.io/rss.xml",
      "feedStatus": "inactive",
      "feedType": "xml",
      "primaryTags": "Tech"
    },
    {
      "publisher": "A List Apart",
      "feedUrl": "https://alistapart.com/main/feed/",
      "feedStatus": "inactive",
      "feedType": "xml",
      "primaryTags": "Tech"
    },
    {
      "publisher": "Alice GG",
      "feedUrl": "https://alicegg.tech/feed.xml",
      "feedStatus": "active",
      "feedType": "xml",
      "primaryTags": "Tech"
    },
    {
      "publisher": "VentureBeat",
      "feedUrl": "http://feeds.feedburner.com/venturebeat/SZYF",
      "feedStatus": "active",
      "feedType": "xml",
      "primaryTags": "Tech",
      "logo": "https://venturebeat.com/wp-content/themes/vb-news/img/favicon.ico" //https://venturebeat.com/wp-content/themes/vb-news/brand/img/logos/VB_Extended_Logo_40H.png
    },
    {
      "publisher": "Joel on Software",
      "feedUrl": "https://www.joelonsoftware.com/feed/",
      "feedStatus": "active",
      "feedType": "xml",
      "primaryTags": "Tech",
      "logo": "https://i0.wp.com/www.joelonsoftware.com/wp-content/uploads/2016/12/11969842.jpg?fit=32%2C32&#038;ssl=1"
    },
    {
      "publisher": "Sam Newman",
      "feedUrl": "https://samnewman.io/blog/feed.xml",
      "feedStatus": "active",
      "feedType": "xml",
      "primaryTags": "Tech"
    },
    {
      "publisher": "Mozilla Hacks",
      "feedUrl": "https://hacks.mozilla.org/feed/",
      "feedStatus": "active",
      "feedType": "xml",
      "primaryTags": "Tech"
    },
    {
      "publisher": "HACKERNOON",
      "feedUrl": "https://hackernoon.com/feed",
      "feedStatus": "active",
      "feedType": "xml",
      "primaryTags": "Tech",
      "logo": "https://hackernoon.com/favicon.ico"
    },
    {
      "publisher": "TechCrunch",
      "feedUrl": "https://www.techcrunch.com/feed",
      "feedStatus": "active",
      "feedType": "xml",
      "primaryTags": "Tech",
      "logo": "https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png?w=32"
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
      "feedType": "xml",
      "primaryTags": "Tech"
    },
    {
      "publisher": "Coding Horror",
      "feedUrl": "https://blog.codinghorror.com/rss/",
      "feedStatus": "active",
      "feedType": "xml",
      "primaryTags": "Tech",
      "logo": "https://blog.codinghorror.com/favicon.png"
    },
    {
      "publisher": "Jacob Singh",
      "feedUrl": "https://jacobsingh.name/rss/",
      "feedStatus": "active",
      "feedType": "xml",
      "primaryTags": "Tech",
      "logo": "https://jacobsingh.name/favicon.png"
    },
    {
      "publisher": "Game Developer",
      "feedUrl": "https://www.gamedeveloper.com/rss.xml",
      "feedStatus": "active",
      "feedType": "xml",
      "primaryTags": "Tech",
      "logo": "https://www.gamedeveloper.com/images/GD_official_logo.png"
    },
    {
      "publisher": "the HUSTLE",
      "feedUrl": "https://thehustle.co/feed/",
      "feedStatus": "active",
      "feedType": "xml",
      "primaryTags": "Tech",
      "logo": "https://thehustle.co/wp-content/uploads/2022/04/cropped-favicon-32x32.png"
    },
    {
      "publisher": "Software Engineering Tidbits",
      "feedUrl": "https://www.softwareengineeringtidbits.com/feed",
      "feedStatus": "active",
      "feedType": "xml",
      "primaryTags": "Tech"
    },
    {
      "publisher": "The Pragmatic Engineer",
      "feedUrl": "https://newsletter.pragmaticengineer.com/feed",
      "feedStatus": "active",
      "feedType": "xml",
      "primaryTags": "Tech",
      "logo": "https://substackcdn.com/image/fetch/w_256,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F5ecbf7ac-260b-423b-8493-26783bf01f06_600x600.png"
    },
    {
      "publisher": "Musings Of A Caring Techie",
      "feedUrl": "https://www.thecaringtechie.com/feed",
      "feedStatus": "active",
      "feedType": "xml",
      "primaryTags": "Tech",
      "logo": "https://substackcdn.com/image/fetch/w_256,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Fdf5b345b-fff0-4b91-a3d6-9e394fda0510_1280x1280.png"
    },
    {
      "publisher": "Dev Interrupted",
      "feedUrl": "https://devinterrupted.substack.com/feed",
      "feedStatus": "active",
      "feedType": "xml",
      "primaryTags": "Tech",
      "logo": "https://substackcdn.com/image/fetch/w_256,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Feff814ba-ca84-4452-a48d-789e87a955bd_750x750.png"
    },
    {
      "publisher": "The Developing Dev",
      "feedUrl": "https://www.developing.dev/feed",
      "feedStatus": "active",
      "feedType": "xml",
      "primaryTags": "Tech",
      "logo": "https://substackcdn.com/image/fetch/w_256,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffb980aa1-65a4-4e90-aacb-fc07a563b5f7_500x500.png"
    },
    {
      "publisher": "Frontend Engineering",
      "feedUrl": "https://frontendengineering.substack.com/feed",
      "feedStatus": "active",
      "feedType": "xml",
      "primaryTags": "Tech",
      "logo": "https://substackcdn.com/image/fetch/w_256,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fae9cb9cd-5e76-4b86-9942-7ac5aa9891ea_256x256.png"
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
