import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";

const ddbClient = new DynamoDBClient({});

export async function postSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  // Extract the user ID from the request context

  const randomId = v4();
  const item = JSON.parse(event.body || "{}");
  const result = await ddbClient.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
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
