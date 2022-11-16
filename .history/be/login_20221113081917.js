const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

exports.handler = async (event, context, callback) => {
  await login(event)
    .then((data) => {
      callback(null, {
        statusCode: 201,
        body: data.Items,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

function login(e) {
  const params = {
    TableName: "account",
    Key: { username: e.username },
  };
  return ddb.scan(params).promise();
}
