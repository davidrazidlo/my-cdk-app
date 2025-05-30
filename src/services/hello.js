exports.main = async (event, context) => {
  return {
    statusCode: 201,

    body: JSON.stringify({
      message: `Hello, I am reading from: ${process.env.TABLE_NAME} and my region is: ${process.env.AWS_REGION}`,
    }),
  };
};
