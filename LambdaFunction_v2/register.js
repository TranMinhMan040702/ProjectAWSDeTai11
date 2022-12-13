// Create the DynamoDB service client module using ES6 syntax.
import { ScanCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
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

export const handler = async (event, response) => {
  // const body = JSON.parse(event.body);
  const body = event;
  const listEmail = [];
  const listUserName = [];
  try {
    const Record = await ddbClient.send(
      new ScanCommand({ TableName: "UserTable" })
    );
    for (let item of Record.Items) {
      // listID.push(item['UserID']['N']);
      if (body.username === item["username"]["S"]) {
        listUserName.push(body.username);
      }
      if (body.email === item["email"]["S"]) {
        listEmail.push(body.email);
      }
    }

    if (listUserName.length !== 0) {
      throw new Error("Tên tài khoản đã tồn tại");
    }
    if (listEmail.length !== 0) {
      throw new Error("Email đã tồn tại");
    }
    // const newRecordID = Math.max(...listID.map(id => Number(id))) + 1;
    const params = {
      TableName: "UserTable",
      Item: {
        username: body.username,
        password: body.password,
        email: body.email,
      },
    };

    const data = await ddbDocClient.send(new PutCommand(params));
    response = {
      statusCode: 200,
      message: "Đăng ký thành công",
      body: JSON.stringify({
        username: body.username,
        password: body.password,
      }),
    };
  } catch (err) {
    var message = "";
    if (listUserName.length !== 0) {
      message = "Tên tài khoản đã tồn tại";
    } else if (listEmail.length !== 0) {
      message = "Email đã tồn tại";
    }
    response = {
      statusCode: 400,
      body: JSON.stringify(message),
    };
  }

  return response;
};
