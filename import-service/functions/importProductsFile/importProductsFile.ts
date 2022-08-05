import { formatJSONResponse } from "../../libs/responseModify";
import { S3 } from "aws-sdk";
import { middyfy } from "../../libs/lambda";
import { schema } from "./schema";

export const importProductsFile = async (event) => {
  try {
    const params = {
      region: "eu-central-1",
    };
    const validateQueryParameters = schema.validate(
      event.queryStringParameters
    );

    if ("error" in validateQueryParameters) {
      return formatJSONResponse({
        message: validateQueryParameters.error.details[0].message,
        statusCode: 400,
      });
    }
    const { name } = event.queryStringParameters;

    const client = new S3(params);

    const url = await client.getSignedUrlPromise("putObject", {
      Bucket: process.env.BUCKET_NAME,
      Key: `uploaded/${name}`,
      Expires: 60,
      ContentType: "text/csv",
    });

    return formatJSONResponse(url);
  } catch (err) {
    console.log(err);
    return formatJSONResponse({
      message: "Internal error",
      statusCode: 500,
    });
  }
};

export const handler = middyfy(importProductsFile);
