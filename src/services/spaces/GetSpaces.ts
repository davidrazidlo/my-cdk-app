import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function getSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (event.queryStringParameters) {
    if ("id" in event.queryStringParameters) {
      const spaceId = event.queryStringParameters["id"];
      const getItemResponse = ddbClient.send(
        new GetItemCommand({
          TableName: process.env.SPACES_TABLE_NAME,
          Key: {
            id: { S: spaceId },
          },
        })
      );
      if ((await getItemResponse).Item) {
        return {
          statusCode: 201,
          body: JSON.stringify((await getItemResponse).Item || []),
        };
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Space not found" }),
        };
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid query parameters" }),
      };
    }
  }

  const result = await ddbClient.send(
    new ScanCommand({
      TableName: process.env.SPACES_TABLE_NAME,
    })
  );

  console.log(result.Items);
  return {
    statusCode: 201,
    body: JSON.stringify(result.Items || []),
  };
}
