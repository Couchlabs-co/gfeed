import { QueryCommand, QueryCommandOutput } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";
import {jwtDecode} from "jwt-decode";
import * as jose from 'jose';
const he = require('he');

async function GetFeed(dateKeys: string[]) {
  const result = {
    Count: 0,
    Items: <any>[],
  };

  await Promise.all(
    dateKeys.map(async (key) => {
      const command: QueryCommand = new QueryCommand({
        TableName: Table.posts.tableName,
        KeyConditionExpression: "publishedDate = :publishedDate",
        ExpressionAttributeValues: {
          ":publishedDate": { S: key },
        },
        ConsistentRead: true,
      });
      let { Count, Items } = await dbClient.send(command);
      result.Count += Count ?? 0;
      result.Items = result.Items.concat(Items);
    })
  );  

  return result;
}

async function GetUserFeed(dateKeys: string[], userId: string) {
  const result = {
    Count: 0,
    Items: <any>[],
  };

  const userInterests: QueryCommandOutput = await dbClient.send(new QueryCommand({
    TableName: Table.userActions.tableName,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": { S: userId },
    },
    ConsistentRead: true,
  }));

  await Promise.all(
    dateKeys.map(async (key) => {
      const command: QueryCommand = new QueryCommand({
        TableName: Table.posts.tableName,
        KeyConditionExpression: "publishedDate = :publishedDate",
        ExpressionAttributeValues: {
          ":publishedDate": { S: key },
        },
        ConsistentRead: true,
      });
      let { Count, Items } = await dbClient.send(command);
      result.Count += Count ?? 0;
      result.Items = result.Items.concat(Items);
    })
  );

  const publishersUserLikes = userInterests.Items?.filter((item: any) => {
    return item.userAction.S === "likes" && item.contentType.S === "publisher";
  });
  const publishersUserDislikes = userInterests.Items?.filter((item: any) => {
    return item.userAction.S === "dislikes" && item.contentType.S === "publisher";
  });

  const interestsUserFollows = userInterests.Items?.filter((item: any) => {
    return item.userAction.S === "follow" && item.contentType.S === "interest";
  });

  if(publishersUserDislikes && publishersUserDislikes?.length !== 0) {
    for(const publisher of publishersUserDislikes) {
      result.Items = result.Items.filter((item: any) => {
        return item.publisher?.S !== publisher.content.S;
      });
    }
  }

  if(interestsUserFollows && interestsUserFollows.length !== 0){
    for(const interest of interestsUserFollows){
      result.Items = result.Items.filter((item: any) => {
        return item.tag?.S === interest.content.S || item.tag?.S === "Misc"
      })
    }
  }

  return result;
}

export const handler = ApiHandler(async (evt) => {
  console.log("evt time: ", evt.requestContext.time);
  const keyDates = getFeedDates();
  
  let result = {
    Count: 0,
    Items: <any>[],
  };

  if(evt.headers.authorization) {
    const token = evt.headers.authorization?.split(" ")[1];
    try {
      const tokenHeader = await jwtDecode(token, { header: true });
      const JWKS = jose.createRemoteJWKSet(new URL('https://readingcorner.au.auth0.com/.well-known/jwks.json'));

      const { payload, protectedHeader } = await jose.jwtVerify(token, JWKS, {
        issuer: 'https://readingcorner.au.auth0.com/',
        audience: 'https://api.readingcorner.com',
      })
      if(tokenHeader.kid !== protectedHeader.kid) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Unauthorized" }),
        }
      }
      const sub = payload.sub ?? "";
      const userId = sub.split("|").length > 1 ? sub?.split("|")[1] : sub;

      result = await GetUserFeed(keyDates, userId);
    }
    catch(err) {
      console.log("err: ", err);
      if((err as Error).name === 'JWTExpired') {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Unauthorized" }),
        }
      }
    }
  } else {
    result = await GetFeed(keyDates);
  }
  const feedItems = <any>[];

  for (const item of result.Items) {
    feedItems.push({
      id: item.id.S,
      publishedDate: item.publishedDate.S,
      title: item.title.S && he.decode(item.title.S),
      link: item.link.S && he.decode(item.link.S),
      pubDate: item.pubDate.N,
      author: item.author.S,
      content: item.content.S && he.decode(item.content.S),
      guid: item.guid.S && he.decode(item.guid.S),
      publisher: item.publisher?.S,
      keywords: item.keywords?.S ?? "",
      tag: item.tag?.S ?? "",
      image: item.img?.S ?? "",
    });
  }

  feedItems.sort((a: any, b:any) => {
    return b.pubDate - a.pubDate;
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ Count: feedItems.length, Items: feedItems }),
  };
});
function getFeedDates() {
  const keys = [];
  for (let i = 0; i < 7; i++) {
    const dt = new Date();
    keys.push(new Date(dt.setDate(dt.getDate() - i)).toISOString().split("T")[0]);
  }
  return keys;
}

