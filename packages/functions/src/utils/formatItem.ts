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

function getDescription(item: any, publisher: string) {
  switch(publisher){
    case 'Hacker News':
      return '';
    default:
      return he.decode(item.contentSnippet)
  }
}

function getImage(item: any, publisher: string) {
  const getImageUrl = (url: string) => {
    const index = url.indexOf('?');
    return index > 0 ? url.slice(0, index) : url;
  };

  if (item.mediaContent) {
    return item.mediaContent.$.url;
  }

  if (item.mediaThumbnail && publisher === "HACKERNOON") {
    return getImageUrl(item.mediaThumbnail.$.url.slice(23));
  }

  if (item.mediaThumbnail && publisher === "Financial Times") {
    return item.mediaThumbnail.$.url;
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
    const dt = new Date(item.pubDate).toISOString().split("T")[0];
    return dt.trim();
  }

  if (item["dc:date"]) {
    const dt = new Date(item["dc:date"]).toISOString().split("T")[0];
    return dt.trim();
  }

  if (item["dc:created"]) {
    const dt = new Date(item["dc:created"]).toISOString().split("T")[0];
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
    case "DAN NORTH":
      return "Dan North";
    case "Financial Times":
      return "Financial Times";
    case "THE WALL STREET JOURNAL":
      return "THE WALL STREET JOURNAL";
    case "Hacker News":
      return "Hacker News";
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

function getCategories(item: any, publisher: string) {
  let keywords = "";
  switch(publisher) {
    case "CoinDesk": {
      return Array.from(new Set(item.categories.map((cat: any) => cat._))).join(',');
    }
    case "Overreacted":
      keywords = "React, JavaScript, Web Development, software development, programming";
      return keywords
    case "Martin Fowler":
      keywords = "software development, programming";
      return keywords;
    case "FAST COMPANY":
      return item.categories.map((cat: any) => cat.toLowerCase()).join(',');
    case "The New York Times":
      if (item.categories && item.categories.length > 1 && typeof item.categories !== "string") {
        return item.categories.map((cat: Record<any, any>) => cat._.toLowerCase()).join(',');
      }
      return '';
    case "The Guardian":
      return item.categories.map((cat: Record<any, any>) => cat._.toLowerCase()).join(',');
   default: {
    if (item.categories && item.categories.length > 1 && typeof item.categories !== "string") {
      keywords = Array.from(new Set(item.categories.map((cat: string) => cat && cat.includes('/') ? cat.slice(cat.lastIndexOf('/')+1) : cat)
        .map((cat: string) => cat.toLowerCase()))).join(',');
    } else if (item.categories && typeof item.categories === "string") {
      keywords = item.categories.toLowerCase();
    }
    return keywords;
   }
  }
}


function extractImageFromDescription(description: any): string {
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const imgSrc = imgRegex.exec(description);
  return imgSrc ? imgSrc[1] : "";
}

function getItemGuid(item: any, publisher: string) {
  switch(publisher) {
    default:
      return he.decode(item.guid ?? item.id).trim()
  }
}


  export const formatItem = (item: any, publisher: string, tag: string): Record<any, AttributeValue> => {
    let img = "";
    let pubDate: string|number;
  
    try {
      const keywords = getCategories(item, publisher);
  
      const publishedDate = getPublishedDate(item, publisher) as string;
  
      const guid = getItemGuid(item, publisher);
    
      pubDate = publishedDate ? new Date(publishedDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
      img = getImage(item, publisher) ?? '';
    
      switch(publisher) {
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
        guid: { S: guid },
        keywords: { S: keywords ?? tag },
        tag: { S: tag },
        publisher: { S: publisher },
        content: { S: getDescription(item, publisher) },
        img: { S: img ?? "" },
      };
    
      return feedItem;
    
    }
    catch (error) {
      console.log('formatItem item', item.title, item.publisher);
      console.log('formatItem error', error);
    }
    return {};  
  };