import { ListTablesCommand,DescribeTableCommand,DynamoDBClient } from "@aws-sdk/client-dynamodb";
// Set the AWS Region.
const REGION = "us-east-1"; //e.g. "us-east-1"
// Create an Amazon DynamoDB service client object.
const ddbClient = new DynamoDBClient({ region: REGION });

export const handler = async(event,response) => {
    const body = JSON.parse(event.body);
    try {
        const tableDataList = []
        const {TableNames} = await ddbClient.send(new ListTablesCommand({}));
        for(const tablename of TableNames){
            const params = { TableName: tablename }
            if(tablename.includes(body.username + "-")){
              const data = await ddbClient.send(new DescribeTableCommand(params));
              if(data.Table.AttributeDefinitions){
                  const newTableData = {
                    tablename,
                    AttributeDefinitions: data.Table.AttributeDefinitions
                  }
                  tableDataList.push(newTableData)
              }
            }
        }
        
        response = {
            statusCode: 200,
            body: JSON.stringify(tableDataList),
        };
          
        return response
      } catch (err) {
        response = {
            statusCode: 400,
            body: JSON.stringify('Can not get table!' + err),
        };
        return response
      }
};