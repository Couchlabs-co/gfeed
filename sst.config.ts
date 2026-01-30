/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "gfeed",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      // profile: "couchlabs-dev",
      region: "ap-southeast-2",
      stage: input?.stage || "dev",
    };
  },
  async run() {
    await import("./stacks/Database");
    await import("./stacks/Api");
    await import("./stacks/Functions");
    await import("./stacks/Web");
  },
});
