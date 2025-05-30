import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface LambdaStackProps extends StackProps {
  spacesTable: ITable;
}

export class LambdaStack extends Stack {
  public readonly spacesLambdaIntegration: LambdaIntegration;
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const spacesLambda = new NodejsFunction(this, "spacesLambda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: join(__dirname, "..", "services", "spaces", "handler.ts"),
      environment: {
        SPACES_TABLE_NAME: props.spacesTable.tableName,
      },
    });

    // Grant the Lambda function permissions to read and write to the DynamoDB table
    spacesLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Scan",
          "dynamodb:DeleteItem",
        ],
        resources: [props.spacesTable.tableArn],
      })
    );

    // after you construct your NodejsFunction:
    props.spacesTable.grantReadWriteData(spacesLambda);

    this.spacesLambdaIntegration = new LambdaIntegration(spacesLambda);
  }
}
