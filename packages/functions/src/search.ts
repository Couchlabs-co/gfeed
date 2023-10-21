import { AttributeValue, ScanCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";
import { APIGatewayProxyEventV2 } from "aws-lambda";


export const handler = ApiHandler(async (evt: APIGatewayProxyEventV2) => {
  console.log("evt time: ", evt.requestContext.time);

  const {searchText} = JSON.parse(evt.body ?? '');

  if(!searchText) {
    return {
      statusCode: 400,
      body: JSON.stringify({"message": "Bad Request"})
    };
  }

  try {
      const scanCommand = new ScanCommand({
        TableName: Table.article.tableName,
        FilterExpression: "contains(#link, :searchText) OR contains(#title, :searchText) OR contains(#author, :searchText) OR contains(#keywords, :searchText) OR contains(#publisher, :searchText) OR contains(#content, :searchText)",
        ExpressionAttributeNames: {
          "#link": "link",
          "#title": "title",
          "#author": "author",
          "#keywords": "keywords",
          "#publisher": "publisher",
          "#content": "content"
        },
        ExpressionAttributeValues: {
          ":searchText": { S: searchText },
        },
      });
      const res = await dbClient.send(scanCommand);
      if(res.$metadata.httpStatusCode === 200){
        const items = res.Items;
        console.log("items........", items);
        const articles = items?.map(item => {
          return {
            title: item.title.S,
            link: item.link.S,
            author: item.author.S,
            keywords: item.keywords.S,
            guid: item.guid.S,
            pubDate: item.pubDate.S,
            publisherId: item.publisherId.S,
            publisher: item.publisher.S,
            publishedDate: item.publishedDate.S,
            content: item.content.S,
            id: item.id.S
          }
        })
        return {
          statusCode: 200,
          body: JSON.stringify({"message": "Success", "result": articles, "count": res.Count})
        }
      }
      return {
        statusCode: res.$metadata.httpStatusCode,
        body: JSON.stringify({"err": "Something went wrong"})
      }
    
  } catch (err) {
    console.log("err........", err);
    return {
      statusCode: 500,
      body: JSON.stringify({"err": "Something went wrong"})
    };
  }

});