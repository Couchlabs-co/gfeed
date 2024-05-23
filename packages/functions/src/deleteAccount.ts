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

type KINDE_API_TOKEN = {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

type DELETE_USER_RESPONSE = {
  message: string;
  code: string;
}

async function deleteUserFromKinde(access_token: string, userId: string): Promise<DELETE_USER_RESPONSE> {

  console.log("Deleting user from Kinde");
  const kindeApiUrl = `${process.env.M2M_AUDIENCE}/v1/user?id=${userId}`;
  const fetchResponse = await fetch(kindeApiUrl, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Accept': 'application/json',
    },
  });
  const response = await fetchResponse.json() as DELETE_USER_RESPONSE;
  return response;  
}

export const handler = ApiHandler(async (evt: APIGatewayProxyEventV2) => {
  console.info("evt time: ", evt.requestContext.time);
  const body: DeleteAccountDTO = JSON.parse(evt.body ?? '');

    try {
      validateConfig();
      const token = evt.headers.authorization?.split(" ")[1];
      const validToken = token && (await validateToken(token));
      if(!validToken) {
        throw new Error("Unauthorized");
      }
      const userFromToken = await getUserFromToken(token);
      if(!body || !body.userId || !body.reason || userFromToken !== body.userId) {
        throw new Error("Bad Request");
      }
      const { userId, reason, longReason } = body;
      
      await saveAccountToBeDeleted(userId, reason, longReason);

      const kindeApiToken = await getManagementToken();

      const userDeletedResponse = await deleteUserFromKinde(kindeApiToken.access_token, userId);
        
      return {
        statusCode: parseInt(userDeletedResponse.code),
        body: JSON.stringify({"msg": userDeletedResponse.message})
      };
        
    }
    catch(err) {
      console.log("err: ", err);
      switch((err as Error).message) {
        case "Unauthorized":
          return {
            statusCode: 401,
            body: JSON.stringify({ error: "Unauthorized" }),
          }
        case "Bad Request":
          return {
            statusCode: 400,
            body: JSON.stringify({"msg": "Bad Request"})
          }
      }
      // if((err as Error).name === 'JWTExpired') {
      //   return {
      //     statusCode: 401,
      //     body: JSON.stringify({ error: "Unauthorized" }),
      //   }
      // } else {
      //   return {
      //     statusCode: 500,
      //     body: JSON.stringify({ error: "Internal Server Error internal" }),
      //   }
      // }

    }
});

async function saveAccountToBeDeleted(userId: string, reason: string, longReason: string | undefined) {
  const userDelete = Table.userDelete.tableName;
  const command: PutItemCommand = new PutItemCommand({
    TableName: userDelete,
    Item: {
      "userId": { S: userId },
      "created": { N: `${Date.now()}` },
      "reason": { S: reason },
      "longReason": { S: longReason ?? "" },
    }
  });
  await dbClient.send(command);
}

async function getManagementToken() {
  const response = await fetch(process.env.M2M_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      audience: process.env.M2M_AUDIENCE!,
      grant_type: "client_credentials",
      client_id: process.env.M2M_CLIENT_ID!,
      client_secret: process.env.M2M_CLIENT_SECRET!,
    }),
  });
  return await response.json() as KINDE_API_TOKEN;
}

function validateConfig() {
  if(process.env.M2M_AUDIENCE === undefined) {
    throw new Error("M2M_AUDIENCE is not set");
  }
  if(process.env.M2M_CLIENT_ID === undefined) {
    throw new Error("M2M_CLIENT_ID is not set");
  }
  if(process.env.M2M_CLIENT_SECRET === undefined) {
    throw new Error("M2M_CLIENT_SECRET is not set");
  }
  if(process.env.M2M_URL === undefined) {
    throw new Error("M2M_URL is not set");
  }
}

