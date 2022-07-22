import { Client } from "pg";
import { IProduct, IStock } from "../models";
export class ProductsService {
  connection: Client;

  async connectoToTheDb() {
    if (!this.connection) {
      this.connection = new Client();
      await this.connection.connect();
    }
  }

  async closeConnection() {
    if (this.connection) {
      await this.connection.end();
    }
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
    
    const newTitle = title.replace(/%20/g, " ")
 
    const product = (
      await this.connection
        .query(`SELECT id, photo_id, title, description, price, "count"
  FROM public.stocks s
  left join products p on p.id = s.product_id
  WHERE p.title = '${newTitle}'
  `)
    ).rows[0] as IProduct & IStock;
    await this.closeConnection();
    console.log(product)
    return product;
  }

  async createProduct(payload: IProduct & IStock): Promise<IProduct & IStock> {
    await this.connectoToTheDb();
    const { description, photo_id, price, title, count } = payload;

    const newProduct: IProduct = (
      await this.createProductItem({
        id: "",
        description,
        photo_id,
        price,
        title,
      })
    ).rows[0];

    const newStock: IStock = (
      await this.createStockItem({ product_id: newProduct.id, count })
    ).rows[0];
    await this.closeConnection();
    return { ...newProduct, ...newStock };
  }

  private createStockItem({ product_id, count }: IStock) {
    return this.connection.query(
      `INSERT INTO stocks ("product_id", "count") VALUES ('${product_id}', ${count}) RETURNING count`
    );
  }

  private createProductItem({ description, photo_id, price, title }: IProduct) {
    return this.connection.query(
      `INSERT INTO products (id, photo_id, title, description, price) VALUES (uuid_generate_v4(),'${photo_id}', '${title}', '${description}', ${price}) RETURNING id, description,
      photo_id,
      price,
      title`
    );
  }
}
