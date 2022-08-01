import AWSMock from "aws-sdk-mock";
import { formatJSONResponse } from "../../libs/responseModify";
import AWS from "aws-sdk";

import { importProductsFile } from "../../functions/importProductsFile/importProductsFile";

describe("Import service - importProductsFile", () => {
  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock("S3", "getSignedUrl", "mockUrl");
  });

  afterAll(() => {
    AWSMock.restore("S3");
  });
  it("should return signed url", async () => {
    const event = {
      queryStringParameters: {
        name: "mock.csv",
      },
    } as any;

    const expectedResult = formatJSONResponse("mockUrl");

    const result = await importProductsFile(event);

    expect(result).toEqual(expectedResult);

  });

  it("should return 400 if invalid query parameters", async () => {
    const event = {} as any;

    const result = await importProductsFile(event);

    expect(result.statusCode).toEqual(400);
  });
});
