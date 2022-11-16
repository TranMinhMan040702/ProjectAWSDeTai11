const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

exports.handler = async (event, context, callback) => {
    await permanentlyDeleteEmployee(event)
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

function permanentlyDeleteEmployee(event) {
    const params = {
        TableName: "employees",
        Key: {
            id: event.queryStringParameters.id,
        },
    };
    return ddb.delete(params).promise();
}
