const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

exports.handler = async (event, context, callback) => {
  await addUser(event)
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

function addUser(event) {
  const params = {
    TableName: "users",
    Item: {
      username: event.queryStringParameters.username,
      password: event.queryStringParameters.password,
      name: event.queryStringParameters.name,
      email: event.queryStringParameters.email,
      address: event.queryStringParameters.address,
      phone: event.queryStringParameters.phone,
      state: event.queryStringParameters.state,
    },
  };
  return ddb.put(params).promise();
}
