import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { validateToken } from "./utils/validateToken";
import { getUserFromToken } from "./utils/getUserFromToken";

interface DeleteAccountDTO {
  userId: string;
  reason: string;
  longReason?: string;
}

export const handler = ApiHandler(async (evt: APIGatewayProxyEventV2) => {
  console.log("evt time: ", evt.requestContext.time);
  const body: DeleteAccountDTO = JSON.parse(evt.body ?? '');

  if(evt.headers.authorization) {
    const token = evt.headers.authorization?.split(" ")[1];
    const validToken = token && await validateToken(token);
    if(!validToken) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" }),
      }
    }
    try {
      const userFromToken = await getUserFromToken(token);
      if(!body || !body.userId || !body.reason || userFromToken !== body.userId) {
        return {
          statusCode: 400,
          body: JSON.stringify({"msg": "Bad Request"})
        };
      }
      const { userId, reason, longReason } = body;
      const userDelete = Table.userDelete.tableName;
      const command: PutItemCommand = new PutItemCommand({
        TableName: userDelete,
        Item: {
          "userId": { S: userId },
          "created": { N: `${Date.now()}` },
          "reason": { S: reason },
          "longReason": { S: longReason ?? ""},
        }
      });
  
      await dbClient.send(command);
      
      return {
        statusCode: 201,
        body: JSON.stringify({"msg": "Success"})
      };
      
    }
    catch(err) {
      console.log("err: ", err);
      if((err as Error).name === 'JWTExpired') {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: "Unauthorized" }),
        }
      }
    }
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" }),
    }
  }
});