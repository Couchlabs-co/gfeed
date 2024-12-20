import { ApiHandler } from "sst/node/api";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import {getInterests} from "./userInterests";
import { validateToken } from "./utils/validateToken";
import { getUserFromToken } from "./utils/getUserFromToken";

enum UserAction {
    likes = "likes",
    dislikes = "dislikes",
    viewed = "viewed",
    bookmark = "bookmark",
    delBookmark = "delBookmark"
}

interface Interest {
    content: string;
    contentType: string;
    userAction: 'likes' | 'dislikes' | 'viewed' | 'bookmark' | 'follow' | 'selected' | 'delBookmark';
    contentLink?: string;
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

  try {
    const token = evt.headers.authorization && evt.headers.authorization?.split(" ")[1];
    const validToken = token && await validateToken(token);
    if(!validToken) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" }),
      }
    }
    const user_id = await getUserFromToken(token);
    if(!user_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({"message": "Bad Request"})
      };
    }

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
  
    const userBookmarks = interestsByAction && interestsByAction.bookmark ? interestsByAction?.bookmark.filter((item: any) => {
        return item.contentType === 'post';
    }) : [];
  
    const feedAlgoSelected = interestsByAction && interestsByAction.selected ? interestsByAction?.selected[0].contentType : 'default';
  
    return {
        statusCode: 200,
        body: JSON.stringify({
            "message": "Success", 
            "data": {
                userId: user_id, 
                interestsByType, 
                interestsByAction,
                stats: {
                    likeCount: userLikedPostsCount,
                    dislikeCount: userDisLikedPostsCount,
                    viewCount: userViewedPostsCount,
                    bookmarkCount: userBookmarks.length
                }
            }})
    };
  } catch(e){
    console.error("err........", e);
    return {
      statusCode: 500,
      body: JSON.stringify({"err": "Something went wrong"})
    };
  }  
});