import { QueryCommand, QueryCommandOutput } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";
import { APIGatewayProxyEventV2 } from "aws-lambda";

interface Interest {
  content: string;
  contentType: string;
  userAction: 'likes' | 'dislikes' | 'viewed' | 'bookmark';
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
    const UserActionsTable = Table.userActions.tableName;
    
    const command: QueryCommand = new QueryCommand({
      TableName: UserActionsTable,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": { S: user_id },
      },
    });
    
    const res: QueryCommandOutput = await dbClient.send(command);
    const interests: Array<Interest> =[];
    
    if(res.Items){
      for(const item of res.Items){
        interests.push({
          content: item.content.S as string,
          userAction: item.userAction.S,
          contentType: item.contentType.S as string,
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
        if(!acc[interestAction]) {
          acc[interestAction] = [];
        }
        acc[interestAction].push(item)
        return acc; 
      }, {});

      return {
        statusCode: 201,
        body: JSON.stringify({"message": "Success", "data": {interestsByType, interestsByAction}})
      };
    }

    return {
      statusCode: 201,
      body: JSON.stringify({"message": "Success", "data": {interestsByType: [], interestsByAction: []}})
    };
    
  } catch (err) {
    console.log("err........", err);
    return {
      statusCode: 500,
      body: JSON.stringify({"err": "Something went wrong"})
    };
  }

  
});