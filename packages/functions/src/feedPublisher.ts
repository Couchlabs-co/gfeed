import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { dbClient } from "./utils/dbClient";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";
import { Queue } from "sst/node/queue";

const sqs = new SQSClient({
  region: "ap-southeast-2",
});

export async function main() {
  const scanCommand = new ScanCommand({
    TableName: Table.feed.tableName,
    ProjectionExpression: "publisher, feedUrl",
  });

  const result = await dbClient.send(scanCommand);
  if (!result.Items) {
    return {
      statusCode: 200,
      body: JSON.stringify({ status: "no items" }),
    };
  }
  for (const feed of result.Items) {
    const msgBody = { feedUrl: feed.feedUrl.S, publisher: feed.publisher.S };
    const params = {
      MessageBody: JSON.stringify(msgBody),
      QueueUrl: Queue.Queue.queueUrl,
    };
    await sqs.send(new SendMessageCommand(params));
    console.log("Sent message to queue", params);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ status: "successful" }),
  };
}
