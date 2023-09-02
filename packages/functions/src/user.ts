// import { QueryCommand } from "@aws-sdk/client-dynamodb";
// import { dbClient } from "./utils/dbClient";
import { ApiHandler } from "sst/node/api";
// import { Table } from "sst/node/table";

export const handler = ApiHandler(async (evt) => {
  console.log("evt time: ", evt.requestContext.time);
  
  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
});
