import { Cron, StackContext, Table, Queue, Function } from "sst/constructs";

export function ReadingFunctionsStack({ stack }: StackContext) {
  
  const FeedQueue = new Queue(stack, "Queue", {
    consumer: "packages/functions/src/feedHandler.main",
    cdk: {
      queue: {
        queueName: `FeedQueue-${stack.stage}`,
      },
    },
  });

  const UserTable = new Table(stack, "User", {
    fields: {
      id: "string",
      firstName: "string",
      lastName: "string",
      email: "string",
      channel: "string",
    },
    primaryIndex: { partitionKey: "email" },
    globalIndexes: { channelIndex: { partitionKey: "channel" } },
  });

  const UsersInterestTables = new Table(stack, "UsersInterest", {
    fields: {
      id: "string",
      userId: "string",
      interest: "string",
      type: "string",
      action: "string",
    },
    primaryIndex: { partitionKey: "userId", sortKey: "interest" },
    globalIndexes: { 
      interestIndex: { partitionKey: "interest" }, 
      typeIndex: { partitionKey: "type" }, 
      actionIndex: { partitionKey: "action" } 
    },
  });

  const BookmarkTable = new Table(stack, "Bookmark", {
    fields: {
      userId: "string",
      postId: "string",
    },
    primaryIndex: { partitionKey: "userId" },
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
      id: "string",
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
    globalIndexes: { authorIndex: { partitionKey: "author", sortKey: "pubDate" }, titleIndex: { partitionKey: "title" } },
  });

  const FeedCron = new Cron(stack, "FeedCron", {
    schedule: "cron(0 */6 * * ? *)",
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
    UserTable,
    UsersInterestTables,
    BookmarkTable
  };
}
