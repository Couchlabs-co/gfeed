import { Cron, StackContext, Table, Queue, Function, Api, SvelteKitSite } from "sst/constructs";

export function ReadingFunctionsStack({ stack }: StackContext) {
  const FeedQueue = new Queue(stack, "Queue", {
    consumer: "packages/functions/src/feedHandler.main",
    cdk: {
      queue: {
        queueName: "FeedQueue",
      },
    },
  });

  const FeedTable = new Table(stack, "Feed", {
    fields: {
      id: "string",
      publisher: "string",
      feedUrl: "string",
    },
    primaryIndex: { partitionKey: "publisher", sortKey: "feedUrl" },
  });

  const ItemsTable = new Table(stack, "item", {
    fields: {
      publishedDate: "string",
      title: "string",
      author: "string",
      link: "string",
      category: "string",
      pubDate: "number",
      guid: "string",
      description: "string",
    },
    primaryIndex: { partitionKey: "publishedDate", sortKey: "pubDate" },
    globalIndexes: { authorIndex: { partitionKey: "author", sortKey: "pubDate" } },
  });

  const FeedCron = new Cron(stack, "FeedCron", {
    schedule: "rate(1 day)",
    job: "packages/functions/src/feedPublisher.main",
  }).bind([FeedTable, FeedQueue]);

  const FeedHandler = new Function(stack, "FeedHandler", {
    handler: "packages/functions/src/feedHandler.main",
    bind: [ItemsTable, FeedQueue],
  });

  FeedQueue.bind([ItemsTable]);

  return {
    ItemsTable,
    FeedTable,
    FeedQueue,
    FeedCron,
    FeedHandler,
  };
}
