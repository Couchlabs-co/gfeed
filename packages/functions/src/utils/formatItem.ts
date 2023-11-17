import { AttributeValue } from "@aws-sdk/client-dynamodb";
import * as uuid from "uuid";
const he = require('he');

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
    const match = he.decode(item["content:encoded"]).match(/(<img.*)src\s*=\s*"(.+?)"/g)[0];
    return getImageUrl(match.slice(match.indexOf('src="')+5));
  }

  if (item["content"] && item["content"].match(/(<img.*)src\s*=\s*'(.+?)'/g) && publisher === "Martin Fowler") {
    const match = he.decode(item["content"]).match(/(<img.*)src\s*=\s*'(.+?)'/g)[0];
    return getImageUrl(match.slice(match.indexOf("https"),match.length-1));
  }

  if (item["content"] && item["content"].match(/(<img.*)src\s*=\s*'(.+?)'/g)) {
    const match = he.decode(item["content"]).match(/(<img.*)src\s*=\s*'(.+?)'/g)[0];
    return getImageUrl(match.slice(match.indexOf('src="')+5));
  }

  if (item["content"] && item["content"].match(/(<img.*)src\s*=\s*"(.+?)"/g)) {
    const match = he.decode(item["content"]).match(/(<img.*)src\s*=\s*"(.+?)"/g)[0];
    return getImageUrl(match.slice(match.indexOf('src="')+5));
  }
}

function getPublishedDate(item: any, publisher: string) {
  if (item.pubDate) {
    const dt = item.pubDate as string;
    return dt.trim();
  }

  if (item["dc:date"]) {
    const dt = item["dc:date"] as string;
    return dt.trim();
  }

  if (item["dc:created"]) {
    const dt = item["dc:created"] as string;
    return dt.trim();
  }
 
  return '';
}

function getAuthor(item: any, publisher: string) {
  
  switch(publisher) {
    case "Overreacted":
      return "Dan Abramov";
    case "Martin Fowler":
      return "Martin Fowler";
    case "Alice GG":
      return "Alice Girard Guittard";
    case "Sam Newman":
      return "Sam Newman";
   default: {
    if(item["dc:creator"]) {
     return item["dc:creator"];
    }
    if(typeof item["author"] !== "string") {
      const author = item["author"][0]["a"].map((author: any) => {
        return author["_"];
      }).join(',');
      return author;
    }
    return item["author"];
   }
  }
}

export const formatItem = (item: any, publisher: string, tag: string): Record<any, AttributeValue> => {
  let keywords, img = "";
  let pubDate: string|number;

  try {
    if (item.categories && item.categories.length > 1 && typeof item.categories !== "string") {
      keywords = Array.from(new Set(item.categories.map((cat: string) => cat.includes('/') ? cat.slice(cat.lastIndexOf('/')+1) : cat)
        .map((cat: string) => cat.toLowerCase()))).join(',');
    } else if (item.categories && typeof item.categories === "string") {
      keywords = item.categories.toLowerCase();
    }

    const publishedDate = getPublishedDate(item, publisher) as string;
  
    pubDate = publishedDate ? new Date(publishedDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
    img = getImage(item, publisher) ?? '';
  
    switch(publisher) {
      case "Overreacted":
        keywords = "React, JavaScript, Web Development, software development, programming";
        break;
      case "Martin Fowler":
        keywords = "software development, programming";
        break;
      case "Alice GG":
        break;
      case "A List Apart":
        if(!img){
          img = extractImageFromDescription(item.description);
        }
        break;
      case "HACKERNOON":
        img = img?.replace("https://hackernoon.com/", "");
        break;
     default:
        break;
    }

    const feedItem: Record<string, AttributeValue> = {
      id: { S: uuid.v4() },
      publishedDate: { S: getPublishedDate(item, publisher) },
      title: { S: he.decode(item.title).trim() },
      link: { S: he.decode(item.link).trim() },
      pubDate: { N: new Date(pubDate).getTime().toString() },
      author: { S: getAuthor(item, publisher) },
      guid: { S: he.decode(item.guid ?? item.id).trim() },
      keywords: { S: keywords ?? tag },
      tag: { S: tag },
      publisher: { S: publisher },
      content: { S: he.decode(item.contentSnippet ?? "") },
      img: { S: img ?? "" },
    };
  
    return feedItem;
  
  }
  catch (error) {
    console.log('item', item.title, item.publisher);
    console.log('error', error);
  }
  return {};  
};

function extractImageFromDescription(description: any): string {
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const imgSrc = imgRegex.exec(description);
  return imgSrc ? imgSrc[1] : "";
}

