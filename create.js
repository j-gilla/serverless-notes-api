import uuid from "uuid";
import AWS from "aws-sdk";

AWS.config.update({ region: "eu-west-1" });

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export function main(event, context, callback) {

  const data = JSON.parse(event.body);
  
  const params = {
    TableName: "notes",
    Item: {
      userid: event.requestContext.identity.cognitoIdentityId,
      notesid: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: new Date().getTime()
    }
  };

  dynamoDb.put(params, (error, data) => {

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    };

    if(error) {
        const response = {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ status: false })
        };
        callback(null, response); 
        return; 
    }

    const response = {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(params.Item)
    };
    callback(null, response);
  });
}
