import { formatJSONResponse } from "../../libs/responseModify";
import { pipeline } from "stream/promises";
import csv from "csv-parser";
import { S3 } from "aws-sdk";
import { S3Event } from "aws-lambda";
import { copyFile } from "../../libs/copyFile";
// import { S3Client, AbortMultipartUploadCommand } from "@aws-sdk/client-s3";

const importFileParser = async (event: S3Event) => {
  try {
    console.log(JSON.stringify(event))

    const params = {
      region: "eu-central-1",
    };
    const records = event.Records.reduce((recordsSum, record) => {
      if (!!record.s3.object.size) {
        recordsSum.push({
          ...record.s3.object,
          bucketName: record.s3.bucket.name,
        });
      }
      return recordsSum;
    }, []);
    const s3 = new S3(params);

    for await (let record of records) {
      const csvParsingStream = csv().on("data", (data) => console.log(data));
      console.log('RECORD: ', record)
      await pipeline([
        s3
          .getObject({
            Bucket: record.bucketName,
            Key: record.key,
          })
          .createReadStream(),
        csvParsingStream,
      ]);
      
      await copyFile(s3, record.key)
    }

    return formatJSONResponse(event);
  } catch (err) {
    console.log(err);
    return formatJSONResponse(err);
  }
};

export const handler = importFileParser;
