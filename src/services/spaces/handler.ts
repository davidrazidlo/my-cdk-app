import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { postSpaces } from "./PostSpaces";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let statusCode: number;
  let message: string;

  switch (event.httpMethod) {
    case "GET":
      statusCode = 200;
      message = "Hello from Lambda GET method!";
      break;

    case "POST":
      return await postSpaces(event, ddbClient);

    default:
      statusCode = 405;
      message = "Method Not Allowed - Only GET and POST are allowed.";
      break;
  }

  console.log(event);

  return {
    statusCode,
    body: JSON.stringify({ message }),
  };
}

export { handler };
