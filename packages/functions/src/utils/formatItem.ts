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
  img?: string;
}

function getImage(item: any, publisher: string) {
  const getImageUrl = (url: string) => {
    const index = url.indexOf('?');
    return index > 0 ? url.slice(0, index) : url;
  };

  if (item.mediaContent) {
    return getImageUrl(item.mediaContent.$.url);
  }

  if (item.mediaThumbnail && publisher === "HACKERNOON") {
    return getImageUrl(item.mediaThumbnail.$.url.slice(23));
  }

  if (item.mediaThumbnail) {
    return getImageUrl(item.mediaThumbnail.$.url);
  }

  if (item.enclosure) {
    return getImageUrl(item.enclosure.url);
  }

  if (item["content:encoded"] && item["content:encoded"].match(/(<img.*)src\s*=\s*"(.+?)"/g)) {
    const match = item["content:encoded"].match(/(<img.*)src\s*=\s*"(.+?)"/g)[0];
    return getImageUrl(match.slice(match.indexOf('src="')+5));
  }

  if (item["content"] && item["content"].match(/(<img.*)src\s*=\s*'(.+?)'/g)) {
    const match = item["content"].match(/(<img.*)src\s*=\s*'(.+?)'/g)[0];
    return getImageUrl(match.slice(match.indexOf('src="')+5));
  }

  if (item["content"] && item["content"].match(/(<img.*)src\s*=\s*"(.+?)"/g)) {
    const match = item["content"].match(/(<img.*)src\s*=\s*"(.+?)"/g)[0];
    return getImageUrl(match.slice(match.indexOf('src="')+5));
  }
}

export const formatItem = (item: any, publisher: string, tags: string): Record<any, AttributeValue> => {
  let keywords, author, pubDate, img = "";

  try {
    if (item.categories && item.categories.length > 1 && typeof item.categories !== "string") {
      keywords = Array.from(new Set(item.categories.map((cat: string) => cat.includes('/') ? cat.slice(cat.lastIndexOf('/')+1) : cat)
        .map((cat: string) => cat.toLowerCase()))).join(',');
    } else if (item.categories && typeof item.categories === "string") {
      keywords = item.categories.toLowerCase();
    }
  
    pubDate = item.pubDate ? new Date(item.pubDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
    img = getImage(item, publisher) ?? '';
  
    switch(publisher) {
      case "Overreacted":
        author = "Dan Abramov";
        keywords = "React, JavaScript, Web Development, software development, programming";
        break;
      case "Martin Fowler":
        author = "Martin Fowler";
        keywords = "software development, programming";
        break;
      case "Alice GG":
        author = "Alice Girard Guittard";
        break;
      case "Sam Newman":
        author = "Sam Newman";
        break;
      case "A List Apart":
        pubDate = item["dc:date"];
        break;
      case "HACKERNOON":
        img = img?.replace("https://hackernoon.com/", "")
     default:
        author = item["dc:creator"];
    }
  
  
  }
  catch (error) {
    console.log('item', item.title, item.publisher);
    console.log('error', error);
  }

  const feedItem: Record<string, AttributeValue> = {
    id: { S: uuid.v4() },
    publishedDate: { S: pubDate },
    title: { S: encodeURI(item.title) },
    link: { S: encodeURI(item.link) },
    pubDate: { N: new Date(pubDate).getTime().toString() },
    author: { S: author },
    guid: { S: encodeURI(item.guid ?? "null") },
    keywords: { S: keywords ?? tags },
    publisher: { S: publisher },
    content: { S: encodeURI(item.contentSnippet ?? "") },
    img: { S: img ?? "" },
  };

  return feedItem;
  
};
