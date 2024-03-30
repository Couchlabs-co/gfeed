import { Cron, StackContext, Queue, Function, use } from "sst/constructs";
import { Duration } from "aws-cdk-lib";
import { DbStack } from "./DbStack";

export function FunctionStack({ stack }: StackContext) {

  const { PublisherTable, BigTable } = use(DbStack);

  const PostDeadLetterQueue = new Queue(stack, "PostDLQ", {
    cdk: {
      queue: {
        queueName: `PostDLQ-${stack.stage}`,
        visibilityTimeout: Duration.seconds(10),
      }
    }
  });
  
  const FeedQueue = new Queue(stack, "Queue", {
    consumer: "packages/functions/src/rssParser.main",
    cdk: {
      queue: {
        queueName: `FeedQueue-${stack.stage}`,
        visibilityTimeout: Duration.seconds(10),
        deliveryDelay: Duration.seconds(1),
      }
    }
  });

  const PostQueue = new Queue(stack, "PostQ", {
    cdk: {
      queue: {
        queueName: `PostQ-${stack.stage}`,
        visibilityTimeout: Duration.seconds(10),
      }
    }
  });


  const ImageQueue = new Queue(stack, "ImageQueue", {
    consumer: "packages/functions/src/imageFetcher.main",
    cdk: {
      queue: {
        queueName: `ImageQueue-${stack.stage}`,
        visibilityTimeout: Duration.seconds(10),
        deliveryDelay: Duration.seconds(1),
      }
    }
  });

  const RssCron = new Cron(stack, "RssCron", {
    schedule: "cron(0 */3 * * ? *)",
    job: "packages/functions/src/rssPublishers.main",
  }).bind([PublisherTable, FeedQueue, BigTable]);

  const RssParser = new Function(stack, "RssParser", {
    handler: "packages/functions/src/rssParser.main",
    bind: [FeedQueue, PostQueue, BigTable, PublisherTable, ImageQueue],
    logRetention: "three_days",
  });

  const ImageFetcher = new Function(stack, "ImageFetcher", {
    handler: "packages/functions/src/imageFetcher.main",
    bind: [ImageQueue, BigTable],
    logRetention: "three_days",
  });

  FeedQueue.bind([PostDeadLetterQueue, BigTable, PublisherTable, ImageQueue]);

  ImageQueue.bind([BigTable]);

  return {
    FeedQueue,
    RssCron,
    RssParser,
    ImageQueue,
    ImageFetcher
  };
}
