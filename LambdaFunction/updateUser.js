const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

exports.handler = async (event, context, callback) => {
  await updateUser(event)
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

function updateUser(event) {
  const params = {
    TableName: "users",
    Key: {
      username: event.queryStringParameters.username,
    },
    ConditionExpression: "attribute_exists(username)",
    UpdateExpression:
      "SET area = :area, address = :address, email = :email, nameUser = :nameUser, phone = :phone, password = :password",
    ExpressionAttributeValues: {
      ":area": event.queryStringParameters.area,
      ":address": event.queryStringParameters.address,
      ":email": event.queryStringParameters.email,
      ":nameUser": event.queryStringParameters.nameUser,
      ":phone": event.queryStringParameters.phone,
      ":password": event.queryStringParameters.password,
    },
    ReturnValues: "ALL_NEW",
  };
  return ddb.update(params).promise();
}
