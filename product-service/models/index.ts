import { IProduct } from "./product";
import { IStock } from "./stock";

type Product = IProduct & IStock;

export { IProduct, IStock, Product };
