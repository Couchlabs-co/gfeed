import Parser from 'rss-parser';


const fetchStandardXMLRSSFeed = async (feedUrl: string) => {
  try {
    let parser = new Parser({
      customFields: {
        item: [
          ['media:thumbnail', 'mediaThumbnail'],
          ['media:content', 'mediaContent'],
          ['enclosure', 'enclosure']
        ]  
      }
    });
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
