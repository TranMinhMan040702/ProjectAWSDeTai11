const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

exports.handler = async (event, context, callback) => {
<<<<<<< HEAD:be/login.js
    await login(event)
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

function login(event) {
    const params = {
        TableName: "account",
        Key: { username: event.queryStringParameters.username },
    };
    return ddb.get(params).promise();
=======
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
>>>>>>> 288f9fa556b6361b0aced7b19837127c98db7575:LambdaFunction/getOneUserByUsername.js
}
