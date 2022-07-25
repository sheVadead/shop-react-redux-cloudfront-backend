import { formatJSONResponse } from "../../../libs/responseModify";
import { productList } from "../../../mocks/productsList";

const getProductsList = async () => {
  return formatJSONResponse(productList || []);
};

export const handler = getProductsList;
