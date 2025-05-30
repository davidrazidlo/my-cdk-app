import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  switch (event.httpMethod) {
    case "GET":
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Hello from Lambda",
        }),
      };
      break;

    case "POST":
      return {
        statusCode: 201,
        body: JSON.stringify({
          message: "Resource created successfully",
        }),
      };
      break;

    default:
      return {
        statusCode: 405,
        body: JSON.stringify({
          message: "Method Not Allowed",
        }),
      };
      break;
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: "",
  };

  console.log(event);
  return response;
}

export { handler };
