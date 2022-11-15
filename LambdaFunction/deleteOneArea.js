const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

exports.handler = async (event, context, callback) => {
  await deleteOneUser(event)
    .then((data) => {
      callback(null, {
        statusCode: 200,
        body: data.Item,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};
function deleteOneUser(event) {
  const params = {
    Key: {
      id: event.queryStringParameters.id,
    },
    TableName: "areas",
    UpdateExpression: "SET isDeleted = :isDeleted",
    ExpressionAttributeValues: {
      ":isDeleted": event.queryStringParameters.state,
    },
    ReturnValues: "ALL_NEW",
  };
  return ddb.update(params).promise();
}
