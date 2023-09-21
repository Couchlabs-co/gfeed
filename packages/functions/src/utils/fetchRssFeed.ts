// import fetch from "node-fetch";
import Parser from 'rss-parser';


const fetchStandardXMLRSSFeed = async (feedUrl: string) => {
  try {
    let parser = new Parser();
    const feed = await parser.parseURL(feedUrl);
    return feed.items;
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return [];
  }
};

const fetchRSSFeed = async (publisher: string, feedUrl: string) => {
  return fetchStandardXMLRSSFeed(feedUrl);
};

export default fetchRSSFeed;
