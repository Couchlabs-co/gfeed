import { QueryCommand, QueryCommandOutput } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";
import { APIGatewayProxyEventV2 } from "aws-lambda";
const he = require('he');

enum UserAction {
  likes = "likes",
  dislikes = "dislikes",
  viewed = "viewed",
  bookmark = "bookmark",
  follow = "follow",
  unfollow = "unfollow",
  selected = "selected",
}

interface Interest {
  content: string;
  contentId: string;
  contentType: string;
  userAction: keyof typeof UserAction;
  contentLink?: string;
}

export const getInterests = async (userId: string) => {
  const BigOneTable = Table.bigTable.tableName;
    
    const command: QueryCommand = new QueryCommand({
      TableName: BigOneTable,
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": { S: `user#${userId}` },
      },
    });
    
    const res: QueryCommandOutput = await dbClient.send(command);

    const interests: Array<Interest> =[];
    
    console.log(`res Items: -> ${JSON.stringify(res.Items)}`);
    if(res.Items){
      for(const item of res.Items){
        if(item.sk.S === 'info') {
          continue;
        }
        interests.push({
          content: he.decode(item.ct.S) as string,
          contentId: item.cid.S as string,
          userAction: UserAction[item.ua.S as keyof typeof UserAction],
          contentType: item.ctt.S as string,
          contentLink: item.cl?.S as string
        })
      }
      
      const interestsByType = interests.reduce((acc, item) => {
        const interestType: string = item.contentType;
        if(interestType !== undefined && !acc[interestType]) {
          acc[interestType] = [];
        }
        acc[interestType].push(item);
        return acc; 
      }, {} as Interest);

      const interestsByAction = interests.reduce((acc, item) => {
        const interestAction = item.userAction;
        if(interestAction !== undefined && !acc[interestAction]) {
          acc[interestAction] = [];
        }
        acc[interestAction].push(item)
        return acc; 
      }, {});

      return {
        interestsByType,
        interestsByAction
      }
    }
    return {
      interestsByType: [],
      interestsByAction: []
    }
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
    
    const {interestsByAction, interestsByType} = await getInterests(user_id);

      return {
        statusCode: 200,
        body: JSON.stringify({"message": "Success", "data": {interestsByType, interestsByAction}})
      };
    
  } catch (err) {
    console.log("err........", err);
    return {
      statusCode: 500,
      body: JSON.stringify({"err": "Something went wrong"})
    };
  }

  
});