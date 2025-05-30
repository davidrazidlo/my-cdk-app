import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";

interface ApiStackProps extends StackProps {
  helloLambdaIntegration: LambdaIntegration;
}

export class ApiStack extends Stack {
  constructor(scope: any, id: string, props?: any) {
    super(scope, id);

    const api = new RestApi(this, "SpacesApi");
    const spacesResource = api.root.addResource("spaces");
    spacesResource.addMethod("GET", props.helloLambdaIntegration);
  }
}
