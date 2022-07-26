import { formatJSONResponse } from "../../libs/responseModify";
import { S3 } from "aws-sdk";

const importProductsFile = async () => {
    const params = {
        Bucket: 'sheva-aws-bucket-v2',
        Prefix: 'import/'
    }
    const s3 = new S3({region: 'eu-central-1'});
    const s3Respons = await s3.listObjectsV2(params).promise();
    console.log(s3Respons.Contents)
  return formatJSONResponse([]);
};

export const handler = importProductsFile;
