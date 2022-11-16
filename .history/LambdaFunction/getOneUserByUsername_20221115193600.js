const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

exports.handler = async (event, context, callback) => {
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
}
