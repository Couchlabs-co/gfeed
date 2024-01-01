import { AttributeValue, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";
import { APIGatewayProxyEventV2 } from "aws-lambda";

const createSource = async (sourceName: string, sourceUrl: string) => {
  const sourceTable = Table.sources.tableName;
    const sourceRecord: Record<string, AttributeValue> = {
      sourceName: { S: sourceName },
      sourceUrl: { S: sourceUrl },
      status: { S: 'New' },
      createdAt: { S: new Date().toISOString() },
    };
    const command = new UpdateItemCommand({
      TableName: sourceTable,
      Key: {
        sourceName: { S: sourceName},
      },
      UpdateExpression: "set #sourceUrl = :sourceUrl, #status = :status, #createdAt = :createdAt",
      ExpressionAttributeNames: {
        "#sourceUrl": "sourceUrl",
        "#status": "status",
        "#createdAt": "createdAt",
      },
      ExpressionAttributeValues: {
        ":sourceUrl": sourceRecord.sourceUrl,
        ":status": sourceRecord.status,
        ":createdAt": sourceRecord.createdAt,
      },
      ReturnValues: "ALL_NEW",
    });

    const res = await dbClient.send(command);
    return res;
}

export const handler = ApiHandler(async (evt: APIGatewayProxyEventV2) => {
  console.log("evt time: ", evt.requestContext.time);

  
  const {sourceName, sourceUrl} = JSON.parse(evt.body ?? '');
  
  if(!sourceName || !sourceUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({"msg": "Bad Request"})
    };
  }

  try {
    if(sourceName){
      const res = await createSource(sourceName, sourceUrl);
      return {
        statusCode: 201,
        body: JSON.stringify({"msg": "Success", "source": res})
      }
    }
    
  } catch (err) {
    console.log("err........", err);
    return {
      statusCode: 500,
      body: JSON.stringify({"err": "Something went wrong"})
    };
  }

});