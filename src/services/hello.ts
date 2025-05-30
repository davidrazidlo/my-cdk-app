import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { v4 } from "uuid";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({});

async function handler(event: APIGatewayProxyEvent, context: Context) {
  const command = new ListBucketsCommand({});
  const listBucketResult = (await s3Client.send(command)).Buckets;

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({
      message:
        "Hello from lambda, this here are your buckets: " +
        JSON.stringify(listBucketResult),
    }),
  };

  console.log(event);
  return response;
}

export { handler };

// exports.main = async (event, context) => {
//   return {
//     statusCode: 201,

//     body: JSON.stringify({
//       message: `Hello, I am reading from: ${process.env.SPACES_TABLE_NAME} and my region is: ${process.env.AWS_REGION}`,
//     }),
//   };
// };
