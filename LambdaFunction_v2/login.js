// Create the DynamoDB service client module using ES6 syntax.
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
const DEFAULT_REGION = "us-east-1";
// Create an Amazon DynamoDB service client object.
export const ddbClient = new DynamoDBClient({ region: DEFAULT_REGION });

// Create a service client module using ES6 syntax.
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: true, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
};

// Create the DynamoDB document client.
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions,
  unmarshallOptions,
});

export { ddbDocClient };

import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export const handler = async (event, response) => {
  // Set the parameters.
  const params = {
    ProjectionExpression: "username, password, email",
    ExpressionAttributeValues: {
      ":un": JSON.parse(event.body).username,
      ":pw": JSON.parse(event.body).password,
    },
    KeyConditionExpression: "username = :un and password = :pw",
    TableName: "UserTable",
  };
  try {
    const data = await ddbDocClient.send(new QueryCommand(params));
    response = {
      statusCode: 200,
      body: JSON.stringify({
        username: data.Items[0].username,
        password: data.Items[0].password,
        email: data.Items[0].email,
      }),
    };
  } catch (err) {
    response = {
      statusCode: 400,
      body: JSON.stringify(
        "Đăng nhập thất bại, vui lòng kiểm tra lại tài khoản hoặc mật khẩu !!!"
      ),
    };
  }

  return response;
};
