import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export async function updateSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  // If there are any query parameters...
  if (
    event.queryStringParameters &&
    "id" in event.queryStringParameters &&
    event.body
  ) {
    const spaceId = event.queryStringParameters["id"]!;
    const requestBodyKey = Object.keys(JSON.parse(event.body))[0];
    const requestBodyValue = event.body[requestBodyKey];

    const updateResult = await ddbClient.send(
      new UpdateItemCommand({
        TableName: process.env.SPACES_TABLE_NAME,
        Key: {
          id: { S: spaceId },
        },
        UpdateExpression: `SET ${requestBodyKey} = :value`,
        ExpressionAttributeValues: {
          ":value": { S: requestBodyValue },
        },
        ExpressionAttributeNames: {
          "#key": requestBodyKey,
        },
        ReturnValues: "UPDATED_NEW",
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify(
        updateResult.Attributes ? unmarshall(updateResult.Attributes) : {}
      ),
    };
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid query parameters" }),
    };
  }
}
