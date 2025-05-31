import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayAuthorizerResult, APIGatewayProxyEvent } from "aws-lambda";

const dbbClient = new DynamoDBClient({});

export async function postSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayAuthorizerResult> {
  // Extract the user ID from the request context

  // Return a dummy APIGatewayAuthorizerResult for now
  return {
    principalId: "user",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: "*",
        },
      ],
    },
  };
}
