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
  wrapNumbers: true, // false, by default.
};

// Create the DynamoDB document client.
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions,
  unmarshallOptions,
});

export { ddbDocClient };

import { PutCommand } from "@aws-sdk/lib-dynamodb";

// Set the parameters
export const params = (body) => {
  return {
    TableName: body.tablename,
    Item: body.item,
  };
};
export const handler = async (event, response) => {
  const body = JSON.parse(event.body);
  try {
    const data = await ddbDocClient.send(new PutCommand(params(body)));
    response = {
      statusCode: 200,
      body: JSON.stringify("Add item successfully!"),
    };
  } catch (err) {
    response = {
      statusCode: 400,
      body: JSON.stringify("Add item failed!!! " + err),
    };
  }

  return response;
};
