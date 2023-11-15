import { AttributeValue, QueryCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { PostType } from "./types"

const getPost = async (title: string) => {
  const postTable = Table.posts.tableName;
  const postQuery = new QueryCommand({
    TableName: postTable,
    IndexName: "titleIndex",
    KeyConditionExpression: "#title = :title",
    ExpressionAttributeNames: {
      "#title": "title",
    },
    ExpressionAttributeValues: {
      ":title": { S: title },
    },
  });

  const res = await dbClient.send(postQuery);
  const posts: Array<PostType> = [];
  if(res.Count && res.Count > 0 && res.Items) {
    for(const post of res.Items) {
      const { id, title, author, link, tag, keywords, publishedDate, img, pubDate, publisher, publisherId} = post;
      posts.push({
        id: id.S!,
        title: title.S!,
        author: author.S!,
        link: link.S!,
        tag: tag.S!,
        keywords: keywords.S!,
        publishedDate: publishedDate.S!,
        img: img.S!,
        publisher: publisher.S!,
        publisherId: publisherId.S!,
        pubDate: Number(pubDate.N!),
      })
    }
  }
  return {
    Count: res.Count,
    Items: posts,
  }

}

export const handler = ApiHandler(async (evt: APIGatewayProxyEventV2) => {
  console.log("evt time: ", evt.requestContext.time);
  const post_title = evt.pathParameters?.postTitle;

  if(!post_title) {
    return {
      statusCode: 400,
      body: JSON.stringify({"message": "Bad Request"})
    };
  }

  try {
      const res = await getPost(post_title);
      return {
        statusCode: 200,
        body: JSON.stringify({"message": "Success", "posts": res})
      }
    
  } catch (err) {
    console.log("err........", err);
    return {
      statusCode: 500,
      body: JSON.stringify({"err": "Something went wrong"})
    };
  }

});