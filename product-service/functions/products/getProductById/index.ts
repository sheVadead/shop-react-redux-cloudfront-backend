import { schema } from "./schema";
import { handlerPath } from "../../../libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/getProductById.handler`,
  events: [
    {
      http: {
        method: "get",
        path: "/products/{productId}",
        request: {
          schemas: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};
