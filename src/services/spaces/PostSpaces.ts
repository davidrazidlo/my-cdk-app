import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";

export async function postSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const randomId = v4();
  let parsedBody: any;
  try {
    parsedBody = event.body ? JSON.parse(event.body) : {};
  } catch (error) {
    console.error("Failed to parse request body", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request body" }),
    };
  }

  if (!parsedBody.location) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "'location' is required" }),
    };
  }

  const tableName = process.env.SPACES_TABLE_NAME;
  if (!tableName) {
    throw new Error("Environment variable SPACES_TABLE_NAME is not set");
  }
  const result = await ddbClient.send(
    new PutItemCommand({
      TableName: tableName,
      Item: {
        id: {
          S: randomId,
        },
        location: {
          S: parsedBody.location,
        },
      },
    })
  );
  console.log(result);
  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Space created successfully!",
      id: randomId,
    }),
  };
}
