import { formatJSONResponse } from "../../../libs/responseModify";
import { productList } from "../../../mocks/productsList";
import { middyfy } from "../../../libs/lambda";
// import { ValidatedEventAPIGatewayProxyEvent } from "../../../types";
// import schema from "./schema";

export const getProductById = async (event) => {
  try {
    const { id } = event.pathParameters;

    if (isNaN(+id)) {
      return formatJSONResponse("Invalid argument type", 400);
    }
    const product =
      productList.find((product) => product.id === +id) ||
      {message: "There is no product with such id", statusCode: 404};

    return formatJSONResponse(product);
  } catch (err) {
    return formatJSONResponse(err, 500);
  }
};

export const handler = middyfy(getProductById);
