import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { postSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { updateSpace } from "./UpdateSpace";

const ddbClient = new DynamoDBClient({});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let statusCode: number;
  let message: string;

  switch (event.httpMethod) {
    case "GET":
      return await getSpaces(event, ddbClient);

    case "POST":
      return await postSpaces(event, ddbClient);

    case "PUT":
      return await updateSpace(event, ddbClient);

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
