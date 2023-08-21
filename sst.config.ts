import { SSTConfig } from "sst";
import { ReadingFunctionsStack } from "./stacks/ReadingStack";

export default {
  config(_input) {
    return {
      name: "reading-functions",
      region: "ap-southeast-2",
    };
  },
  stacks(app) {
    app.stack(ReadingFunctionsStack);
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }
  },
} satisfies SSTConfig;
