const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

exports.handler = async (event, context, callback) => {
    // TODO implement
    await getAllEmployee()
        .then((data) => {
            callback(null, {
                statusCode: 200,
                body: data.Items,
            });
        })
        .catch((err) => {
            console.error(err);
        });
};

function getAllEmployee() {
    const params = {
        TableName: "employees",
    };
    return ddb.scan(params).promise();
}
