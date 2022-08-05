import { IProduct } from "./product";
import { IStock } from "./stock";

export type S3Record = {
  key: string;
  bucketName: string;
};

export type Product = IProduct & IStock;
