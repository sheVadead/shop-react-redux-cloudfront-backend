import { formatJSONResponse } from "../../../libs/responseModify";
import { middyfy } from "../../../libs/lambda";
import { ProductsService } from "../../../services/products.service";

import { schema } from "./schema";

export const createProduct = async (event) => {
  let productService: ProductsService;
  try {
    productService = new ProductsService();

    const validateBody = schema.validate(event.body);
    
    if ("error" in validateBody) {
      return formatJSONResponse({
        message: validateBody.error.details[0].message,
        statusCode: 400,
      });
    }
    const newProduct = await productService.createProduct(event.body);

    return formatJSONResponse({
      message: `Product with id - ${newProduct.id} was created`,
    });
  } catch (err) {
    await productService.closeConnection();
    return formatJSONResponse(err, 500);
  }
};

export const handler = middyfy(createProduct);
