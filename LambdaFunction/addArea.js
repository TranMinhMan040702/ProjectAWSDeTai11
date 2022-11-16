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
    TableName: "areas",
    Item: {
      id: event.queryStringParameters.id,
      nameArea: event.queryStringParameters.nameArea,
      address: event.queryStringParameters.address,
      isDeleted: event.queryStringParameters.isDeleted,
    },
  };
  return ddb.put(params).promise();
}
