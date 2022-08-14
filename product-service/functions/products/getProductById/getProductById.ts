import { formatJSONResponse } from "../../../libs/responseModify";
import { middyfy } from "../../../libs/lambda";
import { ProductsService } from "../../../services/products.service";
import { IProduct, IStock } from "../../../models";
import { schema } from "./schema";

export const getProductById = async (event) => {
  let productService: ProductsService;
  try {
    const validateParameters = schema.validate(event.pathParameters);
    productService = new ProductsService();
 
    if ("error" in validateParameters) {
      console.log(validateParameters.error);
      return formatJSONResponse({
        message: validateParameters.error.details[0].message,
        statusCode: 400,
      });
    }

    const { productId } = event.pathParameters;

    const product: IProduct & IStock = await productService.findProductById(
      productId
    );

    return formatJSONResponse(
      product || {
        message: "There is no product with such id",
        statusCode: 404,
      }
    );
  } catch (err) {
    await productService.closeConnection();
    return formatJSONResponse(err, 500);
  }
};

export const handler = middyfy(getProductById);
