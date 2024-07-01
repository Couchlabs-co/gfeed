import { AttributeValue } from "@aws-sdk/client-dynamodb";
import * as uuid from "uuid";
import { getTime, getYear, getMonth, format } from 'date-fns';
const he = require('he');
import formatDate from "./formatDate";
// import { parse } from 'node-html-parser';
import getImage from "./extractImage";
import extractAuthor from "./extractAuthor";
import extractKeywords from "./extractKeywords";

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


function extractImageFromDescription(description: any): string {
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const imgSrc = imgRegex.exec(description);
  return imgSrc ? imgSrc[1] : "";
}

function getItemGuid(item: any, publisher: string) {

  switch(publisher) {
    case "InfoQ": {
      return he.decode(item.guid.trim().slice(0, item.guid.indexOf('utm_')));
    }
    case "BBC Sport":
    case "LeadDev":
    case "Uber Blog":
    case "Lambda the Ultimate":
          return he.decode(item.link.toLowerCase().trim());
    case "Mitchell Hashimoto":
    case "The Guardian":
    case "DAN NORTH":
    case "A List Apart":
    case "HuffPost":
    case "luke6xff tech blog":
    case "The Daily WTF":
    case "Moneycontrol":
    case "Business Today":
    case "Capitalmind":
    case "Mint":
    case "NPR":
    case "Microsoft Security Response Center":
    case "Overreacted":
    case "footballlondon":
    case "AppleInsider News":
    case "Stackademic":
    case "BleepingComputer":
    case "espncricinfo":
      return he.decode(item.guid.trim());
    case "Martin Fowler":
    case "The Information":
    case "TokyoDev":
    case "Sam Newman":
    case "Reddit":
    case "Deku":
    case "Swiftjective-C":
    case "Business Insider":
    case "The Verge":
      return he.decode(item.id.trim()).toString();
    case "The LeadTech Diet":
    case "Health & WellBeing":
      return he.decode(item.guid['#text'].trim());
    default:
      if(item.guid && typeof item.guid['#text'] === "string"){
        return he.decode(item.guid['#text'].trim());
      } else if(item.guid['#text']) {
        return item.guid['#text'].toString();
      } else {
        return he.decode(item.id).toString();
      }
  }
}

function getItemLink(item: any, publisher: string) {
  if(typeof item.link === "object"){
    return he.decode(item.link['@_href'].trim().slice(0, item.link['@_href'].indexOf('utm')));
  }
  if(item.link.includes('utm_source')){
    return he.decode(item.link.trim().slice(0, item.link.indexOf('utm')));
  } else {
    return he.decode(item.link.trim());
  }
}

function getItemDescription(item: any, publisher: string) {
  if(item.content){
    return he.decode(item.content['#text'].trim());
  }
  if(item.description && item.description['#text']){
    return he.decode(item.description['#text'].trim());
  } else if(item.description){
    return he.decode(item.description.trim());
  }
  return '';
}

function getItemTitle(item: any, publisher: string): string {
  if(typeof item.title === 'object'){
    return he.decode(item.title['#text'].trim());
  }
  if(publisher === "Reddit"){
    item.title = item.title.indexOf('[P]') || item.title.indexOf('[D]') ? item.title.slice(3) : item.title;
    return he.decode(item.title.trim());
  }
  return he.decode(item.title.trim());
}

export const formatItem = (item: any, publisher: string, tag: string, payWall: boolean, feedUrl: string): Record<any, AttributeValue> => {
  let img = "";

  try {
    const publishedDate = formatDate(item, publisher);
    const pubDate = getTime(publishedDate.toString()) ;

    
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
    
    const pk = Number(`${getYear(publishedDate.toString())}${("0"+(getMonth(publishedDate.toString())+1)).slice(-2)}`);
    
    const feedItem: Record<string, AttributeValue> = {
      id: { S: uuid.v4() },
      pk: { S: `${pk}` },
      sk: { S: getItemGuid(item, publisher) },
      publishedDate: { S: publishedDate.toString() },
      title: { S: getItemTitle(item, publisher) },
      link: { S: getItemLink(item, publisher) },
      pubDate: { N: `${pubDate}` },
      author: { S: extractAuthor(item, publisher) },
      guid: { S: getItemGuid(item, publisher) },
      keywords: { S: extractKeywords(item, publisher) ?? tag },
      tag: { S: tag },
      publisher: { S: publisher },
      content: { S: getItemDescription(item, publisher) },
      img: { S: img ?? "" },
      payWall: { BOOL: payWall }
    };

    return feedItem;
  
  }
  catch (error) {
    console.log('formatItem item error', publisher, feedUrl, item.title);
    console.log('formatItem error', error);
  }
  return {};  
};