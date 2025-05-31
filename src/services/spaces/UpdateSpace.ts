import {
  DynamoDBClient,
  UpdateItemCommand,
  ReturnValue, // ← import this
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export async function updateSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (
    !event.queryStringParameters ||
    !("id" in event.queryStringParameters) ||
    !event.body
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Missing query parameter 'id' or empty body",
      }),
    };
  }

  let parsedBody: Record<string, any>;
  try {
    parsedBody = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Request body is not valid JSON" }),
    };
  }

  const keys = Object.keys(parsedBody);
  if (keys.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Request body must have at least one field to update",
      }),
    };
  }

  const spaceId = event.queryStringParameters["id"]!;
  const requestBodyKey = keys[0];
  const requestBodyValue = parsedBody[requestBodyKey];

  const updateParams = {
    TableName: process.env.SPACES_TABLE_NAME!,
    Key: {
      id: { S: spaceId },
    },
    UpdateExpression: `SET #key = :value`,
    ExpressionAttributeNames: {
      "#key": requestBodyKey,
    },
    ExpressionAttributeValues: {
      ":value": { S: String(requestBodyValue) },
    },
    // ← Use the ReturnValue enum instead of a raw string
    ReturnValues: ReturnValue.UPDATED_NEW,
  };

  try {
    const updateResult = await ddbClient.send(
      new UpdateItemCommand(updateParams)
    );
    const updatedAttributes = updateResult.Attributes
      ? unmarshall(updateResult.Attributes)
      : {};
    return {
      statusCode: 200,
      body: JSON.stringify(updatedAttributes),
    };
  } catch (err: any) {
    console.error("DynamoDB update error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Could not update item in DynamoDB",
        details: err.message || String(err),
      }),
    };
  }
}
