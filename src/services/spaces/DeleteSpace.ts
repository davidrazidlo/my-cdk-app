import {
  DeleteItemCommand,
  DynamoDBClient,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export async function deleteSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (
    !event.queryStringParameters ||
    !("id" in event.queryStringParameters) ||
    !event.body
  ) {
    const deleteResult = await ddbClient.send(
      new DeleteItemCommand({
        TableName: process.env.SPACES_TABLE_NAME!,
        Key: {
          id: { S: event.queryStringParameters!.id },
        },
      })
    );
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Missing query parameter 'id' or empty body",
      }),
    };
  }
}
