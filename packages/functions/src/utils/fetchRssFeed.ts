// import Parser from 'rss-parser';
import fetch from "node-fetch";
const { XMLParser } = require("fast-xml-parser");

const fetchStandardXMLRSSFeed = async (feedUrl: string, feedType: string) => {
  try {
    console.log('fetchStandardXMLRSSFeed feedUrl', feedUrl, feedType);
    const response = await fetch(feedUrl);
    const xmlData = await response.text();
    const options = {
      // attributeNamePrefix: '@_',
      attrNodeName: 'attr', // default is 'false'
      // textNodeName: '#text',
      ignoreAttributes: false,
      ignoreNameSpace: false,
      allowBooleanAttributes: true,
      parseNodeValue: true,
      parseAttributeValue: true,
      trimValues: true,
      parseTrueNumberOnly: false,
    };

    const parser = new XMLParser(options);
    let jObj = parser.parse(xmlData);
    if(feedType === 'atom') {
      return jObj.feed.entry;
    } else {
      return jObj.rss.channel.item;
    }
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return [];
  }
};

const fetchRSSFeed = async (publisher: string, feedUrl: string, feedType: string) => {
  return fetchStandardXMLRSSFeed(feedUrl, feedType);
};

export default fetchRSSFeed;
