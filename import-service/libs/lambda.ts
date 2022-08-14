import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import inputOutputLogger from "@middy/input-output-logger";

export const middyfy = (handler) => {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(
      inputOutputLogger({
        logger: (event) => {
          if (!event.response) {
            if (event.event?.Records) {
              const { eventSource, eventName } = event.event.Records[0];
              console.log(
                `Event name: ${eventName}, event source: ${eventSource}`
              );
            }
          }
        },
      })
    )
    .use(httpErrorHandler());
};
