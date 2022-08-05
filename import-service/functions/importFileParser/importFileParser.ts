import { formatJSONResponse } from "../../libs/responseModify";
import { pipeline } from "stream/promises";
import csv from "csv-parser";
import { S3 } from "aws-sdk";
import { S3Event } from "aws-lambda";
import { copyFile } from "../../libs/copyFile";
import { Product, S3Record } from "../../models";
import { middyfy } from "../../libs/lambda";

import { SQS } from "aws-sdk";
const processS3Records = async (records: S3Record[], s3Instance: S3) => {
  const dataToSend: Product[] = [];

  for await (let record of records) {
    const csvParsingStream = csv().on("data", (data: Product) =>
      dataToSend.push(data)
    );
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

  return dataToSend;
};

const sqsMessagesHandler = async (messages: Product[]) => {
  const sqs = new SQS();
  const queueName = "catalog-node-queue-sheva";

  const Entries = messages.map((message) => {
    return {
      Id: Math.ceil(Math.random() * (100000 - 1) + 1) + "",
      MessageBody: JSON.stringify(message),
    };
  });
  const { QueueUrl } = await sqs
    .getQueueUrl({ QueueName: queueName })
    .promise();

  await sqs.sendMessageBatch({ Entries, QueueUrl }).promise();
};

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
    const messages = await processS3Records(records, s3Instance);

    await sqsMessagesHandler(messages);
    return formatJSONResponse(event);
  } catch (err) {
    console.log(err);
    return formatJSONResponse(err);
  }
};

export const handler = middyfy(importFileParser);
