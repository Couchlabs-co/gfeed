import { Script, StackContext, Table } from "sst/constructs";

export function DbStack({ stack }: StackContext) {

  const PublisherTable = new Table(stack, "publisher", {
    fields: {
      publisherName: "string",
      feedUrl: "string",
      isActive: "string"
    },
    primaryIndex: { partitionKey: "publisherName", sortKey: "feedUrl" },
    globalIndexes: {
      feedStatusIndex: { partitionKey: "isActive" },
      // isActiveIndex: { partitionKey: "isActive" },
    },
  });

  const FeedbackTable = new Table(stack, "feedback", {
    fields: {
      fullName: "string",
      email: "string",
      topic: "string",
      feedback: "string",
      created: "number",
    },
    primaryIndex: { partitionKey: "email", sortKey: "created" },
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

  const BigTable = new Table(stack, "bigTable", {
    fields: {
      pk: "string",
      sk: "string",
      tag: "string",
      pubDate: "number",
    },
    primaryIndex: { partitionKey: "pk", sortKey: "sk" },
    globalIndexes: { 
      tagPubDateIndex: { partitionKey: "tag", sortKey: "pubDate" },
      timeIndex: { partitionKey: "pk", sortKey: "pubDate" },
    },
  });
  
  new Script(stack, "Script", {
    params:{
      env: stack.stage,
    },
    defaults: {
      function: {
        bind: [PublisherTable, InterestsTable],
      },
    },
    onCreate: "packages/functions/src/seed.handler",
    onUpdate: "packages/functions/src/seed.handler",
  });

  return {
    PublisherTable,
    FeedbackTable,
    InterestsTable,
    NewSources,
    BigTable,
  };
}
