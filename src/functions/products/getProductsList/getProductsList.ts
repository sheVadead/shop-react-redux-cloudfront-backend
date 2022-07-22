import { formatJSONResponse } from "../../../libs/responseModify";
import { ProductsService } from "../../../services/products.service";

const getProductsList = async () => {
  const productService = new ProductsService()
  try {
    
    const products = await productService.getProductsAndStock();
    return formatJSONResponse(products || []);
  } catch (err) {
    console.log(err);
    await productService.closeConnection();
    return formatJSONResponse(err, 500);
  }
};

export const handler = getProductsList;
