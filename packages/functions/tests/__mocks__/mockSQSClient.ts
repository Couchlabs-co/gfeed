import { mockClient } from "aws-sdk-client-mock";
import { SQS, SQSClient } from "@aws-sdk/client-sqs";

const mockSQSClient = mockClient(SQSClient);

export default mockSQSClient;