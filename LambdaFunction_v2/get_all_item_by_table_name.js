import { ScanCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
// Set the AWS Region.
const REGION = "us-east-1"; //e.g. "us-east-1"
// Create an Amazon DynamoDB service client object.
const ddbClient = new DynamoDBClient({ region: REGION });

export const handler = async (event, response) => {
  const body = JSON.parse(event.body);
  const params = {
    TableName: body.tablename,
  };

  try {
    const data = await ddbClient.send(new ScanCommand(params));
    response = {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (err) {
    response = {
      statusCode: 400,
      body: JSON.stringify("Không thể lấy item"),
    };
  }
  return response;
};
