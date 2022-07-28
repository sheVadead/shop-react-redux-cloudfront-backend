import { formatJSONResponse } from "../../libs/responseModify";
import { S3 } from "aws-sdk";
// import { S3Client, AbortMultipartUploadCommand } from "@aws-sdk/client-s3";

const importProductsFile = async (event) => {
  try {
    const params = {
      region: "eu-central-1",
    };
    const { name } = event.queryStringParameters;

    const client = new S3(params);

    const url = await client.getSignedUrlPromise("putObject", {
      Bucket: process.env.BUCKET_NAME,
      Key: `uploaded/${name}`,
      Expires: 60,
      ContentType: 'text/csv'
    });
  
    return formatJSONResponse(url);
  } catch (err) {
    console.log(err);
    return formatJSONResponse(err);
  }
};

export const handler = importProductsFile;
