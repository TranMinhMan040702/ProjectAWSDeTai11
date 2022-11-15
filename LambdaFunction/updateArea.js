const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

exports.handler = async (event, context, callback) => {
  await updateArea(event)
    .then((data) => {
      callback(null, {
        statusCode: 201,
        body: data.Attributes,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

function updateArea(event) {
  const params = {
    TableName: "areas",
    Key: {
      id: event.queryStringParameters.id,
    },
    ConditionExpression: "attribute_exists(id)",
    UpdateExpression: "SET nameArea = :nameArea, address = :address",
    ExpressionAttributeValues: {
      ":nameArea": event.queryStringParameters.nameArea,
      ":address": event.queryStringParameters.address,
    },
    ReturnValues: "ALL_NEW",
  };
  return ddb.update(params).promise();
}
