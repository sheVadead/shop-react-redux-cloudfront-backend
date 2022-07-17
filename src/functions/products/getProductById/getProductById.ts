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
      "There is no product with such id";

    return formatJSONResponse(product);
  } catch (err) {
    return formatJSONResponse(err, 400);
  }
};

export const handler = middyfy(getProductById);
