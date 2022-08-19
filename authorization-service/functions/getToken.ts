import { formatJSONResponse } from "../libs/api-gateway";
import { middyfy } from "../libs/lambda";

const getToken = async (event: any) => {
  try {
    console.log("Event", event);

    const { login, password } = JSON.parse(event.body);

    if (!login || !password) {
      return formatJSONResponse({
        message: "Bad request: login and password are required",
        statusCode: 400,
      });
    }
    const token = Buffer.from(`${login}:${password}`).toString("base64");

    return formatJSONResponse(token);
  } catch (err) {
    console.log(err);
  }
};

export const handler = middyfy(getToken);
