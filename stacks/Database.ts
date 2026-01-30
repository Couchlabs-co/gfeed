export const PublisherTable = new sst.aws.Dynamo("publisher", {
  fields: {
    id: "string", // Add: unique publisher+feed identifier
    publisherName: "string",
    feedUrl: "string",
    isActive: "string",
    crawledStatus: "string", // Add: tracking crawl status
    lastCrawled: "number", // Add: timestamp (number is better for dates)
  },
  primaryIndex: { hashKey: "id" }, // Use id as primary key
  globalIndexes: {
    isActiveIndex: { hashKey: "isActive", rangeKey: "publisherName" }, // Add range key for sorting
    publisherNameIndex: { hashKey: "publisherName", rangeKey: "feedUrl" }, // Keep original access pattern
    crawledStatusIndex: { hashKey: "crawledStatus", rangeKey: "lastCrawled" }, // Add: for crawl monitoring
  },
  transform: {
    table: (args) => {
      args.name = `publishers-${$app.stage}`;
    },
  },
});

export const FeedbackTable = new sst.aws.Dynamo("feedback", {
  fields: {
    id: "string", // Add: unique identifier
    email: "string",
    created: "number",
    status: "string", // Add: for tracking (new/reviewed/resolved)
  },
  primaryIndex: { hashKey: "id" }, // Better: use unique id
  globalIndexes: {
    emailIndex: { hashKey: "email", rangeKey: "created" }, // Keep email access pattern
    statusIndex: { hashKey: "status", rangeKey: "created" }, // Add: for filtering
  },
  transform: {
    table: (args) => {
      args.name = `feedback-${$app.stage}`;
    },
  },
});

export const UserDeleteTable = new sst.aws.Dynamo("userDelete", {
  fields: {
    id: "string", // Add: unique identifier
    userId: "string",
    created: "number",
    status: "string", // Add: pending/completed
  },
  primaryIndex: { hashKey: "id" },
  globalIndexes: {
    userIdIndex: { hashKey: "userId", rangeKey: "created" },
    statusIndex: { hashKey: "status", rangeKey: "created" }, // Add: for processing queue
  },
  transform: {
    table: (args) => {
      args.name = `userDelete-${$app.stage}`;
    },
  },
});

export const InterestsTable = new sst.aws.Dynamo("interests", {
  fields: {
    id: "string",
    interestName: "string",
  },
  primaryIndex: { hashKey: "id" }, // Fix: use id instead of interestName
  globalIndexes: {
    nameIndex: { hashKey: "interestName" }, // Add: for lookup by name
  },
  transform: {
    table: (args) => {
      args.name = `interests-${$app.stage}`;
    },
  },
});

export const NewSources = new sst.aws.Dynamo("sources", {
  fields: {
    sourceName: "string",
    status: "string",
    createdAt: "string", // Add: missing field used in code
  },
  primaryIndex: { hashKey: "sourceName" },
  globalIndexes: {
    statusIndex: { hashKey: "status", rangeKey: "createdAt" }, // Add: for filtering by status
  },
  transform: {
    table: (args) => {
      args.name = `sources-${$app.stage}`;
    },
  },
});

export const BigTable = new sst.aws.Dynamo("bigTable", {
  fields: {
    pk: "string",
    sk: "string",
    tag: "string",
    pubDate: "number",
    publisher: "string",
    entityType: "string", // Add: 'post', 'user', 'bookmark', etc.
  },
  primaryIndex: { hashKey: "pk", rangeKey: "sk" },
  globalIndexes: {
    tagPubDateIndex: { hashKey: "tag", rangeKey: "pubDate" },
    timeIndex: { hashKey: "pk", rangeKey: "pubDate" },
    publisherIndex: { hashKey: "publisher", rangeKey: "pubDate" },
    entityTypeIndex: { hashKey: "entityType", rangeKey: "pubDate" }, // Add: for filtering by type
  },
  transform: {
    table: (args) => {
      args.name = `bigTable-${$app.stage}`;
    },
  },
});
