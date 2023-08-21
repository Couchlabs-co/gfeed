import { Cron, StackContext, Table, Queue, Function } from "sst/constructs";

export function ReadingFunctionsStack({ stack }: StackContext) {
  const feedQueue = new Queue(stack, "Queue", {
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

  const ItemsTable = new Table(stack, "items", {
    fields: {
      id: "string",
      title: "string",
      author: "string",
      link: "string",
      category: "string",
      pubDate: "number",
      guid: "string",
      description: "string",
    },
    primaryIndex: { partitionKey: "id", sortKey: "pubDate" },
    globalIndexes: { authorIndex: { partitionKey: "author", sortKey: "pubDate" } },
  });

  new Cron(stack, "Cron", {
    schedule: "rate(1 minute)",
    job: "packages/functions/src/feedPublisher.main",
  }).bind([FeedTable, feedQueue]);

  new Function(stack, "FeedHandler", {
    handler: "packages/functions/src/feedHandler.main",
    bind: [ItemsTable, feedQueue],
  });
}
