import { formatJSONResponse } from "../../../libs/responseModify";
import { middyfy } from "../../../libs/lambda";
import { ProductsService } from "../../../services/products.service";
import { IProduct, IStock } from "../../../models";

export const getProductById = async (event) => {
  const productService = new ProductsService()
  try {
    const { name } = event.pathParameters;

    if (!name || typeof name !== "string") {
      return formatJSONResponse("Bad request", 400);
    }

    const product: IProduct & IStock = await productService.findProductById(
      name
    );

    return formatJSONResponse(
      product || { message: "There is no product with such id", statusCode: 400 }
    );
  } catch (err) {
    await productService.closeConnection();
    return formatJSONResponse(err, 500);
  }
};

export const handler = middyfy(getProductById);
