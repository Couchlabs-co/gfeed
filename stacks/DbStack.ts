import { Script, StackContext, Table } from "sst/constructs";

export function DbStack({ stack }: StackContext) {

  const UserTable = new Table(stack, "user", {
    fields: {
      id: "string",
      name: "string",
      email: "string",
      channel: "string",
    },
    primaryIndex: { partitionKey: "email" },
    globalIndexes: { channelIndex: { partitionKey: "channel" } },
  });

  const UsersInterestTable = new Table(stack, "interests", {
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
      actionIndex: { partitionKey: "action" },
      userIndex: { partitionKey: "userId" },
    },
  });

  const BookmarkTable = new Table(stack, "bookmark", {
    fields: {
      userId: "string",
      postId: "string",
    },
    primaryIndex: { partitionKey: "userId" },
  });

  const FeedTable = new Table(stack, "feed", {
    fields: {
      id: "string",
      publisher: "string",
      feedUrl: "string",
      feedType: "string",
      feedStatus: "string",
      publisherUrl: "string",
    },
    primaryIndex: { partitionKey: "publisher", sortKey: "feedUrl" },
  });

  const ArticleTable = new Table(stack, "article", {
    fields: {
      id: "string",
      publishedDate: "string",
      title: "string",
      author: "string",
      link: "string",
      keywords: "string",
      pubDate: "number",
      guid: "string",
      content: "string",
      publisher: "string",
    },
    primaryIndex: { partitionKey: "publishedDate", sortKey: "guid" },
    globalIndexes: { authorIndex: { partitionKey: "author", sortKey: "guid" }, titleIndex: { partitionKey: "title" }, publisherIndex: { partitionKey: "publisher" } },
  });

  new Script(stack, "Script", {
    defaults: {
      function: {
        bind: [FeedTable],
      },
    },
    onCreate: "packages/functions/src/seed.handler",
  });

  return {
    ArticleTable,
    FeedTable,
    UserTable,
    UsersInterestTable,
    BookmarkTable
  };
}
