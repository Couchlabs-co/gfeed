import { Script, StackContext, Table } from "sst/constructs";

export function DbStack({ stack }: StackContext) {

  const UserTable = new Table(stack, "user", {
    fields: {
      id: "string",
      name: "string",
      email: "string",
      channel: "string",
      pic: "string",
      createdAt: "string",
    },
    primaryIndex: { partitionKey: "email" },
    globalIndexes: { 
      channelIndex: { partitionKey: "channel" }, 
      idIndex: { partitionKey: "id" } 
    },
  });

  const UserActionsTable = new Table(stack, "userActions", {
    fields: {
      id: "string",
      sk: "string",
      userId: "string",
      userAction: "string", //like, dislike, follow, bookmark, read
      content: "string", //tag, keyword, post title, author, publisher
      contentType: "string", // tag, keyword, post, author, publisher
      contentId: "string",
      contentLink: "string",
    },
    primaryIndex: { partitionKey: "userId", sortKey: "sk" },
    globalIndexes: { 
      contentIndex: { partitionKey: "content" }, 
      contentTypeIndex: { partitionKey: "contentType" },
      userActionIndex: { partitionKey: "userAction" },
    },
  });

  const BookmarkTable = new Table(stack, "bookmark", {
    fields: {
      userId: "string",
      sk: "number",
      contentId: "string",
      content: "string",
      contentType: "string",
      contentLink: "string",
    },
    primaryIndex: { partitionKey: "userId", sortKey: "sk" },
  });

  const PublisherTable = new Table(stack, "publisher", {
    fields: {
      id: "string",
      publisherName: "string",
      feedUrl: "string",
      feedType: "string",
      feedStatus: "string",
      publisherUrl: "string",
      logo: "string",
      primaryTag: "string",
      frequency: "string",
    },
    primaryIndex: { partitionKey: "publisherName", sortKey: "feedUrl" }
  });

  const PostTable = new Table(stack, "posts", {
    fields: {
      id: "string",
      pk: "number",
      publishedDate: "string",
      title: "string",
      author: "string",
      link: "string",
      keywords: "string",
      pubDate: "number",
      guid: "string",
      content: "string",
      publisher: "string",
      publisherId: "string",
      img: "string",
      tag: "string",
    },
    primaryIndex: { partitionKey: "pk", sortKey: "guid" },
    globalIndexes: { 
      authorIndex: { partitionKey: "author", sortKey: "guid" }, 
      titleIndex: { partitionKey: "title" }, 
      publisherIndex: { partitionKey: "publisher" },
      publisherIdIndex: { partitionKey: "publisherId" },
      tagIndex: { partitionKey: "tag" },
    },
  });

  const InterestsTable = new Table(stack, "interests", {
    fields: {
      id: "string",
      interestName: "string",
    },
    primaryIndex: { partitionKey: "interestName" },
  });

  const NewSources = new Table(stack, "sources", {
    fields: {
      sourceName: "string",
      sourceUrl: "string",
      status: "string",
    },
    primaryIndex: { partitionKey: "sourceName" },
  });
  
  new Script(stack, "Script", {
    defaults: {
      function: {
        bind: [PublisherTable, InterestsTable],
      },
    },
    onCreate: "packages/functions/src/seed.handler",
    onUpdate: "packages/functions/src/seed.handler",
  });

  return {
    PostTable,
    PublisherTable,
    UserTable,
    UserActionsTable,
    InterestsTable,
    BookmarkTable,
    NewSources
  };
}
