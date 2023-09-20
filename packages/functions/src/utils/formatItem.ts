import { AttributeValue } from "@aws-sdk/client-dynamodb";
import * as uuid from "uuid";

export const formatItem = (item: any, publisher: string): Record<any, AttributeValue> => {
  let categories, author = "";
  if (item.category && item.category.length > 1 && typeof item.category !== "string") {
    categories = item.category.map((cat: string) => cat.includes('/') ? cat.slice(cat.lastIndexOf('/')+1) : cat).join(',') ;
  } else if (item.category && typeof item.category === "string") {
    categories = item.category;
  }

  switch(publisher) {
    case "Overreacted":
      author = "Dan Abramov";
      categories = "React, JavaScript, Web Development, software development, programming";
      break;
    default:
      author = item["dc:creator"];
  }


  const feedItem: Record<any, AttributeValue> = {
    id: { S: uuid.v4() },
    publishedDate: { S: new Date(item.pubDate).toISOString().split("T")[0] },
    title: { S: encodeURI(item.title) },
    link: { S: encodeURI(item.link) },
    pubDate: { N: new Date(item.pubDate).getTime().toString() },
    author: { S: author },
    guid: { S: encodeURI(item.guid) },
    category: { S: categories },
    publisher: { S: publisher },
  };

  switch (publisher) {
    case "Hacker News":
      feedItem.description = { S: "" };
      break;
    default:
      feedItem.description = { S: encodeURI(item.description) };
  }
  return feedItem;
};
