import { handler } from "../../../src/functions/products/getProductsList/getProductsList";

describe("Products - getProductsList", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it("should return data", async () => {
    const result = await handler()
    expect(result.statusCode).toEqual(200);
  });
});
