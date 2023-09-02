import { SSTConfig } from "sst";
import { ReadingFunctionsStack } from "./stacks/ReadingStack";
import { FrontendStack } from "./stacks/FrontendStack";

export default {
  config(input) {
    return {
      name: "reading-corner",
      region: "ap-southeast-2",
      stage: input.stage,
      profile: input.stage,
    };
  },
  stacks(app) {
    app
      .stack(ReadingFunctionsStack, {
        stackName: `${app.stage}-reading-functions`,
      })
      .stack(FrontendStack, {
        stackName: `${app.stage}-frontend`,
      });
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }
  },
} satisfies SSTConfig;
