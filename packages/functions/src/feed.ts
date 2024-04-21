import { QueryCommand, QueryCommandOutput } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";
import {jwtDecode} from "jwt-decode";
import * as jose from 'jose';
const he = require('he');
import { getMonth, getYear, sub } from 'date-fns';
import { validateToken } from "./utils/validateToken";

async function getTimeBasedFeed() {
  console.log("getting time based feed");
  const today = new Date();
  const currentMonth = ("0" + (getMonth(today) + 1)).slice(-2);
  const currentYear = getYear(today);
  const pk = `post#${currentYear}${currentMonth}`;

  const rangeStart = sub(today, {days: 7});
  const prevMonth = ("0" + (getMonth(rangeStart) + 1)).slice(-2);
  const prevYear = getYear(rangeStart);

  const feedRange = [];

  if(pk === `post#${prevYear}${prevMonth}`) {
    feedRange.push(pk);
  } else {
    feedRange.push(pk);
    feedRange.push(`post#${prevYear}${prevMonth}`);
  }

  const result = {
    Count: 0,    
    Items: <any>[],
  };

  await Promise.all(
    feedRange.map(async (key) => {
      const command: QueryCommand = new QueryCommand({
        TableName: Table.bigTable.tableName,
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: {
          ":pk": { S: `${key}` },
        },
        Limit: 150,
        ConsistentRead: true,
      });
      let { Count, Items } = await dbClient.send(command);
      result.Count += Count ?? 0;
      result.Items = result.Items.concat(Items);
    })
  );
  
  return result;
}

async function getInterestBasedFeed(userInterests: any) {

  console.log("getting interest based feed");
  
  const result = {
    Count: 0,    
    Items: <any>[],
  };

  // removing serendipity of Misc tag. Need a better way to surface Hacker News
  // if(userInterests && userInterests.length >= 0){
  //   userInterests.push({
  //     ct: {
  //       S: 'Misc'
  //     },
  //   })
  // }

  if(userInterests && userInterests.length > 0){
    await Promise.all(
      userInterests.map(async (interest: any) => {
        const command: QueryCommand = new QueryCommand({
          TableName: Table.bigTable.tableName,
          IndexName: 'tagPubDateIndex',
          KeyConditionExpression: "tag = :tag",
          ExpressionAttributeValues: {
            ":tag": { S: interest.ct.S },
          },
          ScanIndexForward: false,
          Limit: 200,
        });
        let { Count, Items } = await dbClient.send(command);
        result.Count += Count ?? 0;
        result.Items = result.Items.concat(Items);
      })
    );
  }

  // const publishersUserLikes = userInterests.Items?.filter((item: any) => {
  //   return item.userAction.S === "likes" && item.contentType.S === "publisher";
  // });
  const publishersUserDislikes = userInterests.Items?.filter((item: any) => {
    return item.userAction.S === "dislikes" && item.contentType.S === "publisher";
  });

  if(publishersUserDislikes && publishersUserDislikes?.length !== 0) {
    for(const publisher of publishersUserDislikes) {
      result.Items = result.Items.filter((item: any) => {
        return item.publisher?.S !== publisher.content.S;
      });
    }
  }
  return result;
}

async function GetUserFeed(userId: string) {
  let result = {
    Count: 0,
    Items: <any>[],
  };

  console.log('getting user feed for user: ', userId);

  const userInterests: QueryCommandOutput = await dbClient.send(new QueryCommand({
    TableName: Table.bigTable.tableName,
    KeyConditionExpression: "pk = :pk",
    FilterExpression: "attribute_exists(ctt)",
    ExpressionAttributeValues: {
      ":pk": { S: `user#${userId}` },
    },
    ConsistentRead: true,
  }));

  const interestsUserFollows = userInterests.Items?.filter((item: any) => {
    return item.ua.S === "follow" && item.ctt.S === "interest";
  });

  const userAlgoPreference = userInterests.Items?.filter((item: any) => {
    return item.ua.S === "selected" && item.ctt.S === "feedAlgo";
  });

  if(userAlgoPreference && userAlgoPreference.length > 0 && interestsUserFollows && interestsUserFollows.length > 0){
    switch(userAlgoPreference[0].ct.S){
      case 'timeBased': {
        result = await getTimeBasedFeed();
        break
      }
      case 'interestBased': {
        result = await getInterestBasedFeed(interestsUserFollows);
        break;
      }
    }
  } else {
    result = await getTimeBasedFeed();
  }

  return result;
}

export const handler = ApiHandler(async (evt) => {
  console.log("evt time: ", evt.requestContext.time);
  
  let result = {
    Count: 0,
    Items: <any>[],
  };

  if(evt.headers.authorization) {
    const token = evt.headers.authorization?.split(" ")[1];
    const validToken = token && await validateToken(token);
    if(!validToken) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" }),
      }
    }
    try {
      const userId = await getUserFromToken(token);
      result = await GetUserFeed(userId);
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
    result = await getTimeBasedFeed();
  }
  const feedItems = <any>[];

  //sorting in descending order of pubDate
  const sortedItems = result.Items.sort(compare);

  for (const item of sortedItems) {
    feedItems.push({
      id: item.id.S,
      publishedDate: item.publishedDate.S,
      title: item.title.S && he.decode(item.title.S),
      link: item.link.S && he.decode(item.link.S),
      pubDate: item.pubDate ? parseInt(item.pubDate.N) : parseInt(item.sk.S),
      author: item.author.S,
      content: item.content.S && he.decode(item.content.S),
      guid: item.guid.S && he.decode(item.guid.S),
      publisher: item.publisher?.S,
      keywords: item.keywords?.S ?? "",
      tag: item.tag?.S ?? "",
      image: item.imgUrl?.S ?? "",
      payWall: item.payWall?.BOOL ?? false,
    });
  }


  return {
    statusCode: 200,
    body: JSON.stringify({ Count: feedItems.length, Items: feedItems }),
  };
});
async function getUserFromToken(token: string) {
  const tokenHeader = await jwtDecode(token, { header: true });
  const JWKS = jose.createRemoteJWKSet(new URL(`${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`));

  const { payload, protectedHeader } = await jose.jwtVerify(token, JWKS, {
    issuer: process.env.KINDE_ISSUER_URL ?? '',
    audience: process.env.KINDE_AUDIENCE ?? '',
  })
  if(tokenHeader.kid !== protectedHeader.kid) {
    throw new Error('Unforbidden');
  }
  const sub = payload.sub ?? "";
  const userId = sub;
  return userId;
}

//Function to sort array of objects based on pubDate attribute
function compare(a: any, b: any) {
  if (a.pubDate.N < b.pubDate.N) {
    return 1;
  }
  if (a.pubDate.N > b.pubDate.N) {
    return -1;
  }
  return 0;
}