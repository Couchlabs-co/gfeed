import { QueryCommand, QueryCommandOutput } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";
const he = require("he");
import { getMonth, getYear, sub } from "date-fns";
import { validateToken } from "./utils/validateToken";
import { getUserFromToken } from "./utils/getUserFromToken";

async function getTimeBasedFeed() {
  console.log("getting time based feed");
  const today = new Date();
  const currentMonth = ("0" + (getMonth(today) + 1)).slice(-2);
  const currentYear = getYear(today);
  const pk = `post#${currentYear}${currentMonth}`;

  const rangeStart = sub(today, { days: 7 });
  const prevMonth = ("0" + (getMonth(rangeStart) + 1)).slice(-2);
  const prevYear = getYear(rangeStart);

  const feedRange = [];

  if (pk === `post#${prevYear}${prevMonth}`) {
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
        IndexName: "timeIndex",
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: {
          ":pk": { S: `${key}` },
        },
        Limit: 300,
        ScanIndexForward: false,
      });
      let { Count, Items } = await dbClient.send(command);
      result.Count += Count ?? 0;
      result.Items = result.Items.concat(Items);
    })
  );

  return result;
}

async function getInterestBasedFeed(
  userInterests: any,
  userDislikedKeywords: (string | undefined)[]
) {
  console.log("getting interest based feed");

  const result = {
    Count: 0,
    Items: <any>[],
  };

  if (userInterests && userInterests.length > 0) {
    await Promise.all(
      userInterests.map(async (interest: any) => {
        const command: QueryCommand = new QueryCommand({
          TableName: Table.bigTable.tableName,
          IndexName: "tagPubDateIndex",
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

  if (!userDislikedKeywords || userDislikedKeywords.length == 0) {
    return result;
  }
  const dislikedKeywords: string = userDislikedKeywords
    .map((item: any) => item.toLowerCase())
    .join(",");

  result.Items = result.Items.filter((item: any) => {
    if (dislikedKeywords.includes(item.tag)) {
      return item;
    }
    return item.keywords.S.split(",").some(
      (keyword: string) => !dislikedKeywords.includes(keyword)
    );
  });
  return result;
}

async function GetUserFeed(userId: string) {
  let result = {
    Count: 0,
    Items: <any>[],
  };

  console.log("getting user feed for user: ", userId);

  const userInterests: QueryCommandOutput = await dbClient.send(
    new QueryCommand({
      TableName: Table.bigTable.tableName,
      KeyConditionExpression: "pk = :pk",
      FilterExpression: "attribute_exists(ctt)",
      ExpressionAttributeValues: {
        ":pk": { S: `user#${userId}` },
      },
      ConsistentRead: true,
    })
  );

  const interestsUserFollows =
    userInterests.Items?.filter((item: any) => {
      return item.ua.S === "follow" && item.ctt.S === "interest";
    }) ?? [];

  const userDislikedKeywords =
    userInterests.Items?.filter((item: any) => {
      return item.ua.S === "dislikes" && item.ctt.S === "post";
    })
      .map((item) => {
        if (item && item.keywords) {
          return item.keywords.S;
        }
      })
      .filter((str) => str) ?? [];

  const userAlgoPreference =
    userInterests.Items?.filter((item: any) => {
      return item.ua.S === "selected" && item.ctt.S === "feedAlgo";
    }) ?? [];

  if (
    userAlgoPreference &&
    userAlgoPreference.length > 0 &&
    interestsUserFollows &&
    interestsUserFollows.length > 0
  ) {
    switch (userAlgoPreference[0].ct.S) {
      case "timeBased": {
        result = await getTimeBasedFeed();
        break;
      }
      case "interestBased": {
        result = await getInterestBasedFeed(interestsUserFollows, []);
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

  if (evt.headers.authorization) {
    const token = evt.headers.authorization?.split(" ")[1];
    const validToken = token && (await validateToken(token));
    if (!validToken) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }
    try {
      const userId = await getUserFromToken(token);
      if (!userId) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Unauthorized" }),
        };
      }
      result = await GetUserFeed(userId);
    } catch (err) {
      console.log("err: ", err);
      if ((err as Error).name === "JWTExpired") {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Unauthorized" }),
        };
      }
    }
  } else {
    result = await getTimeBasedFeed();
  }
  const feedItems = <any>[];

  //sorting in descending order of pubDate
  const sortedItems = result.Items.sort(compare);

  for (const item of sortedItems) {
    if (!item || !item.id || !item.publishedDate || !item.title || !item.link) {
      console.warn("Skipping item due to missing required fields:", item);
      continue;
    }

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
