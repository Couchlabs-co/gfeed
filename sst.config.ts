import { SSTConfig } from "sst";
import { ApiStack } from "./stacks/ApiStack";
import { DbStack } from "./stacks/DbStack";
import { WebStack } from "./stacks/WebStack";
import { FunctionStack } from "./stacks/FunctionStack";

export default {
  config  (input) {
    return {
      name: "intellifeed",
      region: "ap-southeast-2",
      stage: input.stage,
    };
  },
  stacks(app) {
    app
      .stack(DbStack, {
        stackName: `${app.stage}-db`,
      })
      .stack(ApiStack, {
        stackName: `${app.stage}-api`,
      })
      .stack(FunctionStack, {
        stackName: `${app.stage}-functions`,
      })
      .stack(WebStack, {
        stackName: `${app.stage}-web`,
      });
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }
  },
} satisfies SSTConfig;
