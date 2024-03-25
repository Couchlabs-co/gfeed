// import Parser from 'rss-parser';
import fetch from "node-fetch";
const { XMLParser } = require("fast-xml-parser");

const fetchStandardXMLRSSFeed = async (feedUrl: string, feedType: string) => {
  try {
    console.log('fetchStandardXMLRSSFeed feedUrl', feedUrl, feedType);
    const response = await fetch(feedUrl, 
      { headers: 
        { 
          'Content-Type': 'application/xml',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'Cache-Control': 'max-age=0'
        } 
      });
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
    if(jObj.feed && jObj.feed.entry) {
      return jObj.feed.entry;
    } else if(jObj.rss && jObj.rss.entry) {
      return jObj.rss.entry;
    } else if(jObj.rss && jObj.rss.channel && jObj.rss.channel.item) {
      return jObj.rss.channel.item;
    }
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
