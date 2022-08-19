import { formatJSONResponse } from "../libs/api-gateway";
import { middyfy } from "../libs/lambda";
import {
  APIGatewayTokenAuthorizerEvent,
  Context,
  Callback,
  APIGatewayAuthorizerResult
} from "aws-lambda";

export const generatePolicy = (principalId, resource, effect = 'Deny'): APIGatewayAuthorizerResult => {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource,
                },
            ]
        }
    }
}

const basicAuthorizer = async (
  event: APIGatewayTokenAuthorizerEvent,
  _: Context,
  callback: Callback
) => {
  try {
    if (event["type"] !== "TOKEN") {
      callback("Unauthorized");
    }
    console.log("Event", event);
    const { authorizationToken } = event;

    const token = authorizationToken.replace("Basic ", "");

    const [login, password] = Buffer.from(Buffer.from(token, "base64"))
      .toString("utf-8")
      .split(":");
    console.log(`User: ${login}`);
    const authorization = process.env[login];

    const effect =
      authorization && (authorization === password) ? "Allow" : "Deny";
    console.log("Effect", effect);
    return generatePolicy(token, event.methodArn, effect);
  } catch (err) {
    console.log(err);
    callback("Unauthorized");
  }
};

export const handler = middyfy(basicAuthorizer);
