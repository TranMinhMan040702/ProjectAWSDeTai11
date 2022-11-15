const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

exports.handler = async (event, context, callback) => {
  // TODO implement
  await getOneAreaById(event)
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

function getOneAreaById(event) {
  const params = {
    TableName: "areas",
    Key: {
      id: event.queryStringParameters.id,
    },
  };
  return ddb.get(params).promise();
}
