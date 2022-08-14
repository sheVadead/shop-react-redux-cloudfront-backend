import { formatJSONResponse } from "../../../libs/responseModify";
import { middyfy } from "../../../libs/lambda";
import { SQSEvent, SQSRecord } from "aws-lambda";
import { SNS } from "aws-sdk";

import { snsMessageGenerator } from "../../../libs/snsMessageGenerator";

const sendSnsNotifications = async (records: SQSRecord[]) => {
  const sns = new SNS();

  const messagesToSent = await snsMessageGenerator(
    records.map((record) => JSON.parse(record.body))
  );

  console.log("Messages to sent: ", JSON.stringify(messagesToSent, null, 2));

  await sns
    .publishBatch({
      PublishBatchRequestEntries: messagesToSent,
      TopicArn: process.env.SNS_URL,
    })
    .promise();
};

export const catalogBatchProcess = async (event: SQSEvent) => {
  try {
    if (!event.Records || !event.Records.length) {
      return formatJSONResponse({ message: "Nothing", statusCode: 400 });
    }

    const { Records } = event;

    await sendSnsNotifications(Records);

    return formatJSONResponse({
      message: "Notifications are sent",
    });
  } catch (err) {
    console.log(err);
    const { message, statusCode } = err;
    return formatJSONResponse({ message, statusCode });
  }
};

export const handler = middyfy(catalogBatchProcess);
