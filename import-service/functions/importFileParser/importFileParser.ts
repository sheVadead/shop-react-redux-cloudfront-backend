import { formatJSONResponse } from "../../libs/responseModify";
import { pipeline } from "stream/promises";
import csv from "csv-parser";
import { S3 } from "aws-sdk";
import { S3Event } from "aws-lambda";
import { copyFile } from "../../libs/copyFile";
import { S3Record } from "../../models";
import { middyfy } from "../../libs/lambda";

const importFileParser = async (event: S3Event) => {
  try {
    const s3Instance = new S3({
      region: "eu-central-1",
    });

    const records: S3Record[] = event.Records.reduce(
      (formattedRecords: S3Record[], record) => {
        if (!!record.s3.object.size) {
          formattedRecords.push({
            key: record.s3.object.key,
            bucketName: record.s3.bucket.name,
          });
        }
        return formattedRecords;
      },
      []
    );

    for await (let record of records) {
      const csvParsingStream = csv().on("data", (data) => console.log(data));
      const { key, bucketName } = record;
      await pipeline([
        s3Instance
          .getObject({
            Bucket: bucketName,
            Key: key,
          })
          .createReadStream(),
        csvParsingStream,
      ]);

      await copyFile(s3Instance, key, bucketName);
    }

    return formatJSONResponse(event);
  } catch (err) {
    console.log(err);
    return formatJSONResponse(err);
  }
};

export const handler = middyfy(importFileParser);
