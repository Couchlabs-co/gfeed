import { AttributeValue, GetItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
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
  const userTable = Table.bigTable.tableName;
  const userQuery = new GetItemCommand({
    TableName: userTable,
    Key: {
      pk: { S: `user#${id}` },
      sk: { S: "info" },
    },
  });

  let user: User | null = null;
  const res = await dbClient.send(userQuery);
  if(res.Item){
    const { pk, email, name, pic, channel, createdAt } = res.Item;
    user = {
      id: pk.S!,
      email: email.S!,
      name: name.S!,
      pic: pic.S!,
      channel: channel.S!,
      createdAt: createdAt.S!,
    }
  }
  
  return user;
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