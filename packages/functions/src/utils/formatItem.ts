import { AttributeValue } from "@aws-sdk/client-dynamodb";

export const formatItem = (item: any, publisher: string) => {
  const categories = item.category && item.category;
  const feedItem: Record<any, AttributeValue> = {
    publishedDate: { S: new Date(item.pubDate).toISOString().split("T")[0] },
    title: { S: encodeURI(item.title) },
    link: { S: encodeURI(item.link) },
    pubDate: { N: new Date(item.pubDate).getTime().toString() },
    author: { S: item["dc:creator"] },
    guid: { S: encodeURI(item.guid) },
    category: { S: categories ?? "" },
    publisher: { S: publisher },
  };

  switch (publisher) {
    case "Hacker News":
      feedItem.description = { S: "" };
    default:
      feedItem.description = { S: encodeURI(item.description) };
  }
  return feedItem;
};
