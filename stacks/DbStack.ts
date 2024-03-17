import { Script, StackContext, Table } from "sst/constructs";

export function DbStack({ stack }: StackContext) {

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

  // const PostTable = new Table(stack, "posts", {
  //   fields: {
  //     id: "string",
  //     pk: "number",
  //     publishedDate: "string",
  //     title: "string",
  //     author: "string",
  //     link: "string",
  //     keywords: "string",
  //     pubDate: "number",
  //     guid: "string",
  //     content: "string",
  //     publisher: "string",
  //     publisherId: "string",
  //     img: "string",
  //     tag: "string",
  //   },
  //   primaryIndex: { partitionKey: "pk", sortKey: "guid" },
  //   globalIndexes: { 
  //     authorIndex: { partitionKey: "author", sortKey: "guid" }, 
  //     titleIndex: { partitionKey: "title" }, 
  //     publisherIndex: { partitionKey: "publisher" },
  //     publisherIdIndex: { partitionKey: "publisherId" },
  //     tagIndex: { partitionKey: "tag", sortKey: "pk" }
  //   },
  // });

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
    },
    primaryIndex: { partitionKey: "pk", sortKey: "sk" },
    globalIndexes: { 
      tagIndex: { partitionKey: "tag", sortKey: "sk" },
    },
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
    PublisherTable,
    InterestsTable,
    NewSources,
    BigTable,
  };
}
