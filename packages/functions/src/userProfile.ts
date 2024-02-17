import { QueryCommand, QueryCommandOutput } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import {getBookmarks} from "./getBookmarks";
import {getInterests} from "./userInterests";

enum UserAction {
    likes = "likes",
    dislikes = "dislikes",
    viewed = "viewed",
    bookmark = "bookmark"
}

interface Interest {
    content: string;
    contentType: string;
    userAction: 'likes' | 'dislikes' | 'viewed' | 'bookmark';
}

interface UserProfile {
    userId: string;
    name: string;
    stats: {
        likes: number;
        dislikes: number;
        viewed: number;
        bookmarks: number;
    };
    interests: {
        interestsByType: {
            [key: string]: Array<Interest>;
        };
        interestsByAction: {
            [key: string]: Array<Interest>;
        };
    };
}

export const handler = ApiHandler(async (evt: APIGatewayProxyEventV2) => {
  console.log("evt time: ", evt.requestContext.time);
  const user_id = evt.pathParameters?.userId;

  if(!user_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({"message": "Bad Request"})
    };
  }

  try {
    const bookmarks = await getBookmarks(user_id);
    const { interestsByAction, interestsByType } = await getInterests(user_id);

    const userLikedPostsCount = interestsByAction && interestsByAction.likes ? interestsByAction?.likes.filter((item: any) => {
        return item.contentType === 'post';
    }).length : 0;

    const userDisLikedPostsCount = interestsByAction && interestsByAction.dislikes ? interestsByAction?.dislikes.filter((item: any) => {
        return item.contentType === 'post';
    }).length : 0;

    const userViewedPostsCount = interestsByAction && interestsByAction.viewed ? interestsByAction?.viewed.filter((item: any) => {
        return item.contentType === 'post';
    }).length : 0;

    const interestsUserFollow = interestsByAction && interestsByAction.follow ? interestsByAction?.follow.filter((item: any) => {
        return item.contentType === 'interest';
    }) : [];

    const feedAlgoSelected = interestsByAction && interestsByAction.selected ? interestsByAction?.selected[0].contentType : 'default';

    return {
        statusCode: 200,
        body: JSON.stringify({
            "message": "Success", 
            "data": {
                userid: user_id, 
                bookmarks: bookmarks.Items, 
                interestsByType, 
                interestsByAction,
                stats: {
                    likes: userLikedPostsCount,
                    dislikes: userDisLikedPostsCount,
                    viewed: userViewedPostsCount,
                    bookmarks: bookmarks.Count
                }
            }})
    };

    // return {
    //   statusCode: 200,
    //   body: JSON.stringify({"message": "Success", "data": {interestsByType: [], interestsByAction: []}})
    // };
    
  } catch (err) {
    console.log("err........", err);
    return {
      statusCode: 500,
      body: JSON.stringify({"err": "Something went wrong"})
    };
  }

  
});