import axios from "axios";
import { Product } from "../models";
const createProductRequest = async (product: Product) => {
  try {
    console.log("Product: ", product, typeof product);
    const { status, data } = await axios.post(
      process.env.CREATE_PRODUCT_URL,
      product
    );
    return { status, data };
  } catch (err) {
    console.log(err);
    const { data, status } = err.response;
    return { err: data, statusCode: status };
  }
};

export const snsMessageGenerator = async (records: Product[]) => {
  const messagesToSent = [];

  await Promise.all(
    records.map(async (record) => {
      const response = await createProductRequest(record);
      if (response.err) {
        messagesToSent.push({
          Subject: "Product was not created",
          Id: Math.ceil(Math.random() * (100000 - 1) + 1) + "",
          Message: JSON.stringify(response.err),
        });
        return;
      }

      messagesToSent.push({
        Id: Math.ceil(Math.random() * (100000 - 1) + 1) + "",
        Subject: "Product was created",
        Message: `Product - ${record.title} was created`,
        MessageAttributes: snsAttributesGenerator(record),
      });
    })
  );

  return messagesToSent;
};

const snsAttributesGenerator = (record: Product) => {
  const MessageAttributes = {};

  Object.keys(record).forEach((key) => {
    if (record[key]) {
      MessageAttributes[key] = {
        DataType:
          (typeof record[key]).charAt(0).toUpperCase() +
          (typeof record[key]).slice(1),
        StringValue: record[key] ? record[key] + "" : null,
      };
    }
  });
  console.log(
    "snsAttributesGenerator",
    JSON.stringify(MessageAttributes, null, 2)
  );
  return MessageAttributes;
};
