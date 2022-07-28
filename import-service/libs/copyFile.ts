import { S3 } from "aws-sdk";

export const copyFile = async (s3Instance: S3, key: string) => {
  console.log("KEY: ", key);

  console.log("SOURCE: ", encodeURIComponent(`sheva-aws-bucket-v2/${key}`));

  console.log("KEY TO COPY: ", `parsed/${key.split("/")[1]}`);
  
  await s3Instance
    .copyObject({
      Bucket: `sheva-aws-bucket-v2`,
      CopySource: encodeURIComponent(`sheva-aws-bucket-v2/${key}`),
      Key: `parsed/${key.split("/")[1]}`,
    })
    .promise();

  await s3Instance
    .deleteObject({
      Bucket: `sheva-aws-bucket-v2`,
      Key: key,
    })
    .promise();

  console.log("File was copied");
};
