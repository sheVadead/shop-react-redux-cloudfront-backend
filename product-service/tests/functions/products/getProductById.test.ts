import { getProductById } from "../../../functions/products/getProductById/getProductById";
import { ProductsService } from "../../../services/products.service";

describe("Products - getProductById", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it("should return status code 200", async () => {
    jest.spyOn(ProductsService.prototype, "findProductById").mockReturnValue(
      Promise.resolve({
        id: "38c7def4-a741-4926-840f-c34252ff4e3c",
        price: 22,
        title: "mock",
        product_id: "mock",
        count: 2,
      })
    );
    const event = {
      pathParameters: {
        productId: "38c7def4-a741-4926-840f-c34252ff4e3c",
      },
    } as any;

    const result = await getProductById(event);

    expect(result.statusCode).toEqual(200);
  });

  it("should return status code 404", async () => {
    jest.spyOn(ProductsService.prototype, "findProductById").mockReturnValue(
      Promise.resolve(undefined)
    );
    const event = {
      pathParameters: {
        productId: "38c7def4-a741-4926-840f-c34252ff4e3c",
      },
    } as any;

    const result = await getProductById(event);
    expect(result.statusCode).toEqual(404);
  });

  it("should handle absense of product", async () => {
    const event = {
      pathParameters: {
        productId: "38c7def4-a741-4926-840f-c34252ff4e3c",
      },
    } as any;
    jest.spyOn(ProductsService.prototype, "findProductById").mockReturnValue(
      Promise.resolve(undefined)
    );
    const result = await getProductById(event);
    expect(result.body).toEqual(
      JSON.stringify("There is no product with such id")
    );
  });

  it("should handle invalid argument type", async () => {
    const event = {
      pathParameters: {
        productId: "mock",
      },
    } as any;

    const result = await getProductById(event);

    expect(result.body).toEqual(
      "\"\\\"productId\\\" must be a valid GUID\""
    );
  });
});
