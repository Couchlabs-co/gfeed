import * as DB from "./Database";

// Dead Letter Queue for failed RSS parsing
export const PostDeadLetterQueue = new sst.aws.Queue("PostDLQ", {
  transform: {
    queue: (args) => {
      args.messageRetentionSeconds = 1209600; // 14 days
    },
  },
});

// Main RSS Feed Queue with DLQ
export const FeedQueue = new sst.aws.Queue("FeedQueue", {
  transform: {
    queue: (args) => {
      args.visibilityTimeoutSeconds = 900; // 15 minutes
      args.receiveWaitTimeSeconds = 20; // Long polling
    },
  },
});

// Subscribe RSS Parser to Feed Queue
FeedQueue.subscribe(
  {
    handler: "packages/functions/src/rssParser.main",
    link: [DB.PublisherTable, DB.BigTable, PostDeadLetterQueue],
    timeout: "15 minutes",
    memory: "1024 MB",
    nodejs: {
      esbuild: {
        external: ["aws-sdk"],
      },
    },
    transform: {
      function: (args) => {
        args.deadLetterConfig = {
          targetArn: PostDeadLetterQueue.arn,
        };
        args.reservedConcurrentExecutions = 5;
      },
    },
  },
  {
    batch: {
      size: 10,
      window: "20 seconds",
    },
    transform: {
      eventSourceMapping: {
        functionResponseTypes: ["ReportBatchItemFailures"],
      },
    },
  },
);

// Image Queue for async image fetching
export const ImageQueue = new sst.aws.Queue("ImageQueue", {
  transform: {
    queue: (args) => {
      args.visibilityTimeoutSeconds = 300; // 5 minutes
    },
  },
});

// Subscribe Image Fetcher to Image Queue
ImageQueue.subscribe(
  {
    handler: "packages/functions/src/imageFetcher.main",
    link: [DB.BigTable],
    timeout: "5 minutes",
    memory: "512 MB",
    transform: {
      function: (args) => {
        args.reservedConcurrentExecutions = 10;
      },
    },
  },
  {
    batch: {
      size: 5,
      window: "10 seconds",
    },
  },
);

// Cron to trigger RSS feed crawling every 12 hours
export const RssCron = new sst.aws.Cron("RssCron", {
  schedule: "cron(0 */12 * * ? *)", // Every 12 hours
  job: {
    handler: "packages/functions/src/rssPublishers.main",
    link: [DB.PublisherTable, FeedQueue],
    timeout: "5 minutes",
    memory: "512 MB",
  },
});
