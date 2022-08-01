import { schema } from "./schema";
import { handlerPath } from "../../../libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/createProduct.handler`,
  events: [
    {
      http: {
        method: "post",
        path: "/products",
        request: {
          schemas: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};
