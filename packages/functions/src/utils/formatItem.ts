import { AttributeValue } from "@aws-sdk/client-dynamodb";
import * as uuid from "uuid";

export const formatItem = (item: any, publisher: string) => {
  let categories = "";
  if (item.category && item.category.length > 1 && typeof item.category !== "string") {
    categories = item.category.join(",");
  } else if (item.category && typeof item.category === "string") {
    categories = item.category;
  }
  const feedItem: Record<any, AttributeValue> = {
    id: { S: uuid.v4() },
    publishedDate: { S: new Date(item.pubDate).toISOString().split("T")[0] },
    title: { S: encodeURI(item.title) },
    link: { S: encodeURI(item.link) },
    pubDate: { N: new Date(item.pubDate).getTime().toString() },
    author: { S: item["dc:creator"] },
    guid: { S: encodeURI(item.guid) },
    category: { S: categories },
    publisher: { S: publisher },
  };

  switch (publisher) {
    case "Hacker News":
      feedItem.description = { S: "" };
      break;
    default:
      feedItem.description = { S: encodeURI(item.description) };
  }
  return feedItem;
};
