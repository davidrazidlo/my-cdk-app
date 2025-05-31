import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export async function getSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  // If there are any query parameters...
  if (event.queryStringParameters) {
    // Check specifically for an "id" parameter
    if ("id" in event.queryStringParameters) {
      const spaceId = event.queryStringParameters["id"]!;
      // Fetch the single item by id
      const getItemResponse = await ddbClient.send(
        new GetItemCommand({
          TableName: process.env.SPACES_TABLE_NAME,
          Key: {
            id: { S: spaceId },
          },
        })
      );

      if (getItemResponse.Item) {
        // Unmarshall the single item into a plain JS object
        const unmarshalledItem = unmarshall(getItemResponse.Item);
        return {
          statusCode: 200,
          body: JSON.stringify(unmarshalledItem),
        };
      } else {
        return {
          statusCode: 404,
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

  // No query parameters: scan the entire table
  const result = await ddbClient.send(
    new ScanCommand({
      TableName: process.env.SPACES_TABLE_NAME,
    })
  );

  // If there are items, unmarshall each one
  const spaces =
    result.Items?.map((item) => unmarshall(item as Record<string, any>)) || [];

  return {
    statusCode: 200,
    body: JSON.stringify(spaces),
  };
}
