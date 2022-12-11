// console.log(id);
import { DeleteTableCommand } from "@aws-sdk/client-dynamodb";
// Create service client module using ES6 syntax.
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// Set the AWS Region.
const REGION = "us-east-1"; //e.g. "us-east-1"
// Create an Amazon DynamoDB service client object.
const ddbClient = new DynamoDBClient({ region: REGION });
export { ddbClient };

// Set the parameters
export const params = (body) => {
  return {
    TableName: body.TableName,
  };
};

export const handler = async (event, response) => {
  const body = JSON.parse(event.body);
  try {
    const data = await ddbClient.send(new DeleteTableCommand(params(body)));
    response = {
      statusCode: 200,
      body: JSON.stringify("Xoá thành công bảng " + body.TableName),
    };
  } catch (err) {
    response = {
      statusCode: 400,
      body: JSON.stringify("Không thể xoá bảng " + body.TableName),
    };
  }

  return response;
};
