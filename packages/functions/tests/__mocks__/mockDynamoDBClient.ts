import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const mock = mockClient(DynamoDBClient);

export default mock;