import { AttributeValue } from "@aws-sdk/client-dynamodb";
import * as uuid from "uuid";

interface RssItem {
  title: string;
  link: string;
  pubDate?: string;
  updated?: string;
  'dc:creator': string;
  guid?: string;
  category?: string[];
  content?: string; 
}

export const formatItem = (item: any, publisher: string): Record<any, AttributeValue> => {
  let keywords, author, pubDate = "";
  if (item.categories && item.categories.length > 1 && typeof item.categories !== "string") {
    keywords = Array.from(new Set(item.categories.map((cat: string) => cat.includes('/') ? cat.slice(cat.lastIndexOf('/')+1) : cat)
      .map((cat: string) => cat.toLowerCase()))).join(',');
  } else if (item.categories && typeof item.categories === "string") {
    keywords = item.categories.toLowerCase();
  }

  switch(publisher) {
    case "Overreacted":
      author = "Dan Abramov";
      keywords = "React, JavaScript, Web Development, software development, programming";
      pubDate = item.pubDate ? new Date(item.pubDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
      break;
    case "Martin Fowler":
      author = "Martin Fowler";
      keywords = "software development, programming";
      pubDate = item.pubDate ? new Date(item.pubDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
      break;
    default:
      author = item["dc:creator"];
      pubDate = item.isoDate ? new Date(item.isoDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
  }


  const feedItem: Record<any, AttributeValue> = {
    id: { S: uuid.v4() },
    publishedDate: { S: pubDate },
    title: { S: encodeURI(item.title) },
    link: { S: encodeURI(item.link) },
    pubDate: { N: new Date(pubDate).getTime().toString() },
    author: { S: author },
    guid: { S: encodeURI(item.guid ?? "") },
    keywords: { S: keywords ?? "" },
    publisher: { S: publisher },
    content: { S: encodeURI(item.contentSnippet ?? "") },
  };

  return feedItem;
};
