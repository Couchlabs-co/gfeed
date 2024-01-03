import { Cron, StackContext, Queue, Function, use } from "sst/constructs";
import { Duration } from "aws-cdk-lib";
import { DbStack } from "./DbStack";

export function FunctionStack({ stack }: StackContext) {

  const { PostTable, PublisherTable } = use(DbStack);

  const PostDeadLetterQueue = new Queue(stack, "PostDLQ", {
    cdk: {
      queue: {
        queueName: `PostDLQ-${stack.stage}`,
        visibilityTimeout: Duration.seconds(10),
      }
    }
  });
  
  const FeedQueue = new Queue(stack, "Queue", {
    consumer: "packages/functions/src/feedHandler.main",
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
    cdk: {
      queue: {
        queueName: `ImageQueue-${stack.stage}`,
        visibilityTimeout: Duration.seconds(45),
      }
    }
  });

  const FeedCron = new Cron(stack, "FeedCron", {
    schedule: "cron(0 */6 * * ? *)",
    job: "packages/functions/src/feedPublisher.main",
  }).bind([PublisherTable, FeedQueue]);

  const FeedHandler = new Function(stack, "FeedHandler", {
    handler: "packages/functions/src/feedHandler.main",
    bind: [PostTable, FeedQueue, PostQueue],
    logRetention: "three_days",
  });

  FeedQueue.bind([PostTable, PostDeadLetterQueue]);

  return {
    FeedQueue,
    FeedCron,
    FeedHandler,
    ImageQueue,
  };
}
