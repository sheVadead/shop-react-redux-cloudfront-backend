import { handler } from "../../../functions/products/getProductsList/getProductsList";
import { ProductsService } from "../../../services/products.service";

describe("Products - getProductsList", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it("should return data", async () => {
    jest
      .spyOn(ProductsService.prototype, "getProductsAndStock")
      .mockReturnValue(Promise.resolve(undefined));
    const result = await handler();
    expect(result.statusCode).toEqual(200);
  });
});
