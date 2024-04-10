import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { SQSEvent, SQSRecord } from "aws-lambda";
import { parse } from 'node-html-parser';
import { Table } from "sst/node/table";
import { dbClient } from "./utils/dbClient";


export async function main(event: SQSEvent) {
    const tableName = Table.bigTable.tableName;
    const records: SQSRecord[] = event.Records;
    console.log('length of records from queue: ', records.length);
    for(const record of records){
      const startTime = Date.now();
      const {feedItem, publisherId} = JSON.parse(record.body);
      const response = await fetch(feedItem.link.S, { headers: 
        { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'Cache-Control': 'max-age=0'
        } 
      });
      const htmlPage = await response.text();

      const root = parse(htmlPage);
      const imgSrc = root.querySelector('img.article__featured-image')?.rawAttrs.trim();
      if(imgSrc) {
        feedItem.img.S = imgSrc.trim().slice(imgSrc.indexOf('src="')+5, imgSrc.indexOf('" class'));
      }
      await SaveItem(tableName, feedItem, publisherId);
      const endTime = Date.now();
      console.log(`total time taken: ${endTime - startTime}`);
    }
      
    return {
      statusCode: 200,
      body: JSON.stringify({ status: "successful" }),
    };
  }

  async function SaveItem(tableName: string, feedItem: any, publisherId: any) {

    const putQuery = new PutItemCommand({
       TableName: tableName,
       Item: {
         pk: { S: `post#${feedItem.pk.S}` },
         sk: { S: feedItem.sk.S },
         id: { S: feedItem.id.S },
         title: { S: feedItem.title.S },
         content: { S: feedItem.content.S },
         author: { S: feedItem.author.S },
         publisher: { S: feedItem.publisher.S },
         link: { S: feedItem.link.S },
         imgUrl: { S: feedItem.img.S },
         keywords: { S: feedItem.keywords.S },
         publisherId: { S: publisherId.S },
         pubDate: { N: feedItem.pubDate.N },
         tag: { S: feedItem.tag.S },
         guid: { S: feedItem.guid.S },
         publishedDate: { S: feedItem.publishedDate.S },
       },
     });
   await dbClient.send(putQuery);
 }