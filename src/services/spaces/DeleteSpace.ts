import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function deleteSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (!event.queryStringParameters || !event.queryStringParameters.id) {
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
      body: JSON.stringify({ message: "Missing query parameter 'id'" }),
    };
  }
  await ddbClient.send(
    new DeleteItemCommand({
      TableName: process.env.SPACES_TABLE_NAME!,
      Key: {
        id: { S: event.queryStringParameters.id },
      },
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Space deleted" }),
  };
}
