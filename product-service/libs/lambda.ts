import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import inputOutputLogger from "@middy/input-output-logger";

const truthChecker = (obj: any) => {
  const res = {};
  const keysToLog = [
    "pathParameters",
    "body",
    "queryStringParameters",
    "Records",
  ];
  keysToLog.forEach((key: string) => {
    if (obj && obj[key]) {
      res[key] = obj[key];
    }
  });
  return res;
};

export const middyfy = (handler) => {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(
      inputOutputLogger({
        logger: (event) => {
          const httpMethod = event?.event?.httpMethod;
          const path = event?.event?.path;
          if (!event.response) {
            const params = truthChecker(event.event);
            console.log(
              `Incoming request: ${httpMethod} ${path}: ${JSON.stringify(
                params,
                null,
                2
              )}`
            );
          }
        },
      })
    )
    .use(httpErrorHandler());
};
