import { formatJSONResponse } from "../../../libs/responseModify";
import { ProductsService } from "../../../services/products.service";

const getProductsList = async () => {
  let productService: ProductsService;
  try {
    productService = new ProductsService();
    const products = await productService.getProductsAndStock();
    return formatJSONResponse(products || []);
  } catch (err) {
    console.log(err);
    await productService.closeConnection();
    return formatJSONResponse(err, 500);
  }
};

export const handler = getProductsList;
