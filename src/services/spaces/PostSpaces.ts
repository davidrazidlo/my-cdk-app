import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { table } from "console";
import { v4 } from "uuid";

export async function postSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  // Extract the user ID from the request context

  const randomId = v4();
  const item = JSON.parse(event.body || "{}");

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
          S: item.location,
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
