const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

exports.handler = async (event, context, callback) => {
  await permanentlyDeleteUser(event)
    .then((data) => {
      callback(null, {
        statusCode: 201,
        body: data.Item,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

function permanentlyDeleteUser(event) {
  const params = {
    TableName: "users",
    Key: {
      username: event.queryStringParameters.username,
    },
  };
  return ddb.delete(params).promise();
}
