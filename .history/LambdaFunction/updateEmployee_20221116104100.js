const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

exports.handler = async (event, context, callback) => {
    await updateEmployee(event)
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

function updateEmployee(event) {
    const params = {
        TableName: "employees",
        Key: {
            id: event.queryStringParameters.id,
        },
        ConditionExpression: "attribute_exists(id)",
        UpdateExpression:
            "SET fullname = :fullname, address = :address, phone = :phone",
        ExpressionAttributeValues: {
            ":fullname": event.queryStringParameters.fullname,
            ":address": event.queryStringParameters.address,
            ":phone": event.queryStringParameters.phone,
        },
        ReturnValues: "ALL_NEW",
    };
    return ddb.update(params).promise();
}
