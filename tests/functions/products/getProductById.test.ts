import { getProductById } from "../../../src/functions/products/getProductById/getProductById";

describe("Products - getProductById", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it("should return status code 200", async () => {
    const event = {
      pathParameters: {
        productName: "Fanta",
      },
    } as any;

    const result = await getProductById(event);
    expect(result.statusCode).toEqual(200);
  });

  it("should return status code 400", async () => {
    const event = {
      pathParameters: {
        id: "mock",
      },
    } as any;

    const result = await getProductById(event);
    expect(result.statusCode).toEqual(400);
  });

  it("should handle absense of product", async () => {
    const event = {
      pathParameters: {
        id: "99",
      },
    } as any;

    const result = await getProductById(event);
    expect(result.body).toEqual(
      JSON.stringify("There is no product with such id")
    );
  });

  it("should handle invalid argument type", async () => {
    const event = {
      pathParameters: {
        id: "mock",
      },
    } as any;

    const result = await getProductById(event);
    expect(result.body).toEqual(JSON.stringify("Invalid argument type"));
  });
});
