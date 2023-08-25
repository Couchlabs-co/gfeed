import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// Set the AWS Region.
const REGION = "ap-southeast-2"; // Put your correct aws region
// Create an Amazon DynamoDB service client object.
const dbClient = new DynamoDBClient({ region: REGION });

export { dbClient };
