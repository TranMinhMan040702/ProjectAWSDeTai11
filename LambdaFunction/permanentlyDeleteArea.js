const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

exports.handler = async (event, context, callback) => {
  await permanentlyDeleteArea(event)
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

function permanentlyDeleteArea(event) {
  const params = {
    TableName: "areas",
    Key: {
      id: event.queryStringParameters.id,
    },
  };
  return ddb.delete(params).promise();
}
