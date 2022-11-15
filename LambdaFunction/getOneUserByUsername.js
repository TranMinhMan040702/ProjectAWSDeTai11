const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

exports.handler = async (event, context, callback) => {
  // TODO implement
  await getOneUserByUsername(event)
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

function getOneUserByUsername(event) {
  const params = {
    TableName: "users",
    Key: {
      username: event.queryStringParameters.username,
    },
  };
  return ddb.get(params).promise();
}
