import { Client } from "pg";
import { IProduct, IStock } from "../models";
import setupDbQuery from "./setubDB";
import { config } from "../../productServiceConfig";
export class ProductsService {
  connection: Client;

  async connectoToTheDb() {
    try {
      if (!this.connection) {
        this.connection = new Client();
        await this.connection.connect();
      }
      await this.setupTables();
    } catch (err) {
      throw { message: err, statusCode: 500 };
    }
  }

  async closeConnection() {
    if (this.connection) {
      await this.connection.end();
    }
  }

  async setupTables() {
    const tableToCreate = ["stocks", "products"];
    const isNeedToSetup =
      (
        await this.connection.query(`select table_name
    from information_schema."tables" where table_name in ('stocks', 'products')`)
      ).rows.length !== tableToCreate.length
        ? true
        : false;

    if (isNeedToSetup) {
      console.log("Setuping tables");
      await this.connection.query(setupDbQuery);
      return;
    }

    console.log("Tables doesnt need to be setupped");
  }

  async getProductsAndStock() {
    this.connectoToTheDb();
    const joinedProductsAndStocks: (IProduct & IStock)[] = (
      await this.connection
        .query(`SELECT p.id, p.photo_id, p.title, p.description, p.price, s."count"
      FROM public.stocks s
      left join products p on p.id = s.product_id
      `)
    ).rows;

    await this.closeConnection();

    return joinedProductsAndStocks;
  }

  async findProductById(title: string): Promise<IProduct & IStock> {
    await this.connectoToTheDb();

    const newTitle = title.replace(/%20/g, " ");

    const product = (
      await this.connection
        .query(`SELECT id, photo_id, title, description, price, "count"
    FROM public.stocks s
    left join products p on p.id = s.product_id
    WHERE p.title = '${newTitle}'
    `)
    ).rows[0] as IProduct & IStock;
    await this.closeConnection();
    return product;
  }

  async createProduct(payload: IProduct & IStock): Promise<IProduct & IStock> {
    await this.connectoToTheDb();
    try {
      await this.connection.query("BEGIN");

      const newProduct: IProduct = await this.createProductItem(payload);

      if ('error' in newProduct) {
        throw { message: newProduct.error, statusCode: 400 };
      }

      const newStock: IStock = await this.createStockItem({
        product_id: newProduct.id,
        count: payload.count,
      });

      if ('error' in newStock) {
        throw { message: newStock.error, statusCode: 400 };
      }
      await this.connection.query("END");

      await this.closeConnection();

      return { ...newProduct, ...newStock };
    } catch (err) {
      await this.connection.query("ROLLBACK");
      if (err.statusCode) {
        throw { message: err.message, statusCode: err.statusCode };
      }
      throw err;
    }
  }

  private async createStockItem({ product_id, count }: IStock) {
    try {
      const createdStock = (
        await this.connection.query(
          `INSERT INTO stocks ("product_id", "count") VALUES ('${product_id}', ${count}) RETURNING count`
        )
      ).rows[0];
      return createdStock;
    } catch (err) {
      console.log(err);
      return { error: err.detail };
    }
  }

  private async createProductItem(productPayload: IProduct) {
    try {
      const { title, price } = productPayload;
      const createdProduct = (
        await this.connection.query(
          `INSERT INTO products (id, photo_id, title, description, price) VALUES (uuid_generate_v4(),'${
            productPayload?.photo_id || config.defaultImage
          }', '${title}', '${
            productPayload?.description
          }', ${price}) RETURNING id, description,
        photo_id,
        price,
        title`
        )
      ).rows[0];
      return createdProduct;
    } catch (err) {
      console.log(err);
      return { error: err.detail };
    }
  }
}
