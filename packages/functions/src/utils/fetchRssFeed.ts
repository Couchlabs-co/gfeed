import { XMLParser } from "fast-xml-parser";
import fetch from "node-fetch";

const fetchStandardXMLRSSFeed = async (feedUrl: string) => {
  try {
    const response = await fetch(feedUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch RSS feed");
    }
    const parser = new XMLParser();
    const xmlDocument = await response.text();
    let jObj = parser.parse(xmlDocument);
    const rssItems = jObj.rss.channel.item;
    return rssItems;
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return [];
  }
};

const fetchRSSFeed = async (publisher: string, feedUrl: string) => {
  return fetchStandardXMLRSSFeed(feedUrl);
};

export default fetchRSSFeed;
