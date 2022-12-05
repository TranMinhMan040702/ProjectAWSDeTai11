const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

exports.handler = async (event, context, callback) => {
    await addEmployee(event)
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

function addEmployee(event) {
    const params = {
        TableName: "employees",
        Item: {
            id: event.queryStringParameters.id,
            fullname: event.queryStringParameters.fullname,
            address: event.queryStringParameters.address,
            area: event.queryStringParameters.area,
            phone: event.queryStringParameters.phone,
            isDeleted: event.queryStringParameters.isDeleted,
        },
    };
    return ddb.put(params).promise();
}
