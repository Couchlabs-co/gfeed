import { DynamoDB, SQS } from "aws-sdk";
import { Table } from "sst/node/table";
import { Queue } from "sst/node/queue";

const dynamoDb = new DynamoDB.DocumentClient({
  region: "ap-southeast-2",
});

const sqs = new SQS({
  region: "ap-southeast-2",
});

export async function main() {
  const scanInput = {
    TableName: Table.Feed.tableName,
    ProjectionExpression: "publisher, feedUrl",
  };

  const result = await dynamoDb.scan(scanInput).promise();
  if (!result.Items) {
    return {
      statusCode: 200,
      body: JSON.stringify({ status: "no items" }),
    };
  }
  for (const feed of result.Items) {
    const params = {
      MessageBody: JSON.stringify(feed),
      QueueUrl: Queue.Queue.queueUrl,
    };
    await sqs.sendMessage(params).promise();
    console.log("Sent message to queue", params);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ status: "successful" }),
  };
}
