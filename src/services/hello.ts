import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { v4 } from "uuid";

async function handler(event: APIGatewayProxyEvent, context: Context) {
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from lambda, this is the ID: ' + " + v4(),
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
