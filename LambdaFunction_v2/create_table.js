import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
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
    AttributeDefinitions: [
      {
        AttributeName: body.partitionkey,
        AttributeType: body.partitionkeytype,
      },
      {
        AttributeName: body.sortkey,
        AttributeType: body.sortkeytype,
      },
    ],
    KeySchema: [
      {
        AttributeName: body.partitionkey,
        KeyType: "HASH",
      },
      {
        AttributeName: body.sortkey,
        KeyType: "RANGE",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    TableName: body.TableName, //TABLE_NAME
    StreamSpecification: {
      StreamEnabled: false,
    },
  };
};
export const handler = async (event, response) => {
  const body = JSON.parse(event.body);
  body.TableName = body.username + "-" + body.TableName;
  try {
    const data = await ddbClient.send(new CreateTableCommand(params(body)));
    response = {
      statusCode: 200,
      body: JSON.stringify(
        "Bảng " + body.TableName + " đã được tạo thành công"
      ),
    };
  } catch (err) {
    response = {
      statusCode: 400,
      body: JSON.stringify('"Tên bảng đã tồn tại"'),
    };
  }

  return response;
};
