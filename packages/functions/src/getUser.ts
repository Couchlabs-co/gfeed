import { AttributeValue, QueryCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";
import { APIGatewayProxyEventV2 } from "aws-lambda";

type User = {
  id: string;
  email: string;
  name: string;
  pic: string;
  channel: string;
  createdAt: string;
};

const getUser = async (id: string) => {
//   const userId = id.split("|");
  const userTable = Table.user.tableName;
  const userQuery = new QueryCommand({
    TableName: userTable,
    IndexName: "idIndex",
    KeyConditionExpression: "#id = :id",
    ExpressionAttributeNames: {
      "#id": "id",
    },
    ExpressionAttributeValues: {
      ":id": { S: id },
    },
  });

  const users: User[] = [];
    const res = await dbClient.send(userQuery);
    // return res;
    if(res.Count && res.Count > 0 && res.Items) {
      for(const user of res.Items) {
        const { id, email, name, pic, channel, createdAt } = user;
        users.push({
          id: id.S!,
          email: email.S!,
          name: name.S!,
          pic: pic.S!,
          channel: channel.S!,
          createdAt: createdAt.S!,
        })
      }
    }
    return {
      Count: res.Count,
      users,
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
      const res = await getUser(user_id);
      return {
        statusCode: 200,
        body: JSON.stringify({"message": "Success", "user": res})
      }
    
  } catch (err) {
    console.log("err........", err);
    return {
      statusCode: 500,
      body: JSON.stringify({"err": "Something went wrong"})
    };
  }

});