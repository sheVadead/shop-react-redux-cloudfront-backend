import { handler } from "../../../functions/catalog/catalogBatchProcess/catalogBatchProcess";
import { Callback, Context } from "aws-lambda";
import AWSMock from "aws-sdk-mock";

const context = {} as Context;
const callback = null as Callback;

describe("Products - catalogBatchProcess", () => {
  it("should return status code 400 nothing to send", async () => {
    AWSMock.mock("SNS", "publishBatch", "messages sent");
    const event = {
      pathParameters: {
        productId: "38c7def4-a741-4926-840f-c34252ff4e3c",
      },
    } as any;

    const result = await handler(event, context, callback);

    expect(result.statusCode).toEqual(400);
  });

  it("should return status code 200", async () => {
    AWSMock.mock("SNS", "publishBatch", "messages sent");
    const mock = {
      messageId: "3fbf30da-1c7e-476d-812e-f837f252b6fe",
      receiptHandle:
        "AQEBD/k9ZmcQrhsgILX8hX67lyfkF64VoemMROFDxGPmE34R+JVFowflqn0zfUyLpM5SwoADCdl/5dcCXg+Ah9NVtObW//ssFANXLP/mHzF89iiHvziH0waozNPzq/GSOb3TEle/mTNwRaEuRVmk/V4R4MHGH/k82b+GT3QZL4XZ8RjazJYhemRlHht00AkdOUxvb0RnPKIIrgr4acZU5X9h/V7I8OpiOlyLnUkZmL9O5+C7kqMmDYXb2dratPNpDbq8v/7EwJLxknO66drXbFqTtlSmFJhnFCuqUcvfeg9r75vjOZLVqj3Qlj5SAInDxi4c5fzQqoNvBjSnxgb2Nf7T9EQfHKaZj8mfLhJXMkWWN+9dCIxQJeg/5eA9jRid70KS0p2RO7b+zGAlkq1wGQ57PWo9l7LQotu+XkrIJrxmeYc=",
      body: '{"title":"Test1234","description":"qweqwtqwt","photo_id":"","price":"2.4","count":"4"}',
      attributes: {
        ApproximateReceiveCount: "1",
        AWSTraceHeader:
          "Root=1-62f0fe14-67b431f12ae83ebb0c71318a;Parent=5dde83766f17605e;Sampled=0",
        SentTimestamp: "1659960854244",
        SenderId: "AROA2AQTI65UXBDPCYUPQ:import-service-dev-importFileParser",
        ApproximateFirstReceiveTimestamp: "1659960854245",
      },
      messageAttributes: {},
      md5OfBody: "1ae3222133f9e78e18f662296892bb60",
      eventSource: "aws:sqs",
      eventSourceARN:
        "arn:aws:sqs:eu-central-1:688308942697:catalog-node-queue-sheva",
      awsRegion: "eu-central-1",
    };
    const event = {
      Records: [mock],
    } as any;

    const result = await handler(event, context, callback);

    expect(result.statusCode).toEqual(200);
  });
});
