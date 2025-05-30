import { App } from "aws-cdk-lib";
import { DataStack } from "../stacks/Datastack";
import { LambdaStack } from "../stacks/LambdaStack";
import { ApiStack } from "../stacks/Apistack copy";

const app = new App();
const dataStack = new DataStack(app, "DataStack");
const lambdaStack = new LambdaStack(app, "LambdaStack", {
  spacesTable: dataStack.spacesTable,
});
new ApiStack(app, "ApiStack", {
  helloLambdaIntegration: lambdaStack.helloLambdaIntegration,
});
