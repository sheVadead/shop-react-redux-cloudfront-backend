import { S3 } from "aws-sdk";

export const copyFile = async (s3Instance: S3, key: string, bucketName: string) => {
  
  await s3Instance
    .copyObject({
      Bucket: bucketName,
      CopySource: encodeURIComponent(`${bucketName}/${key}`),
      Key: `parsed/${key.split("/")[1]}`,
    })
    .promise();

  await s3Instance
    .deleteObject({
      Bucket: bucketName,
      Key: key,
    })
    .promise();

  console.log("File was copied");
};
