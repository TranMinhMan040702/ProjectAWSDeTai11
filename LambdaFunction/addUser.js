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
      nameUser: event.queryStringParameters.nameUser,
      email: event.queryStringParameters.email,
      address: event.queryStringParameters.address,
      area: event.queryStringParameters.area,
      phone: event.queryStringParameters.phone,
      isDelete: event.queryStringParameters.isDelete,
      role: event.queryStringParameters.role,
    },
  };
  return ddb.put(params).promise();
}
