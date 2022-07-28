import Joi from "joi";

export const schema = Joi.object({
  photo_id: Joi.string(),
  description: Joi.string(),
  title: Joi.string().required(),
  price: Joi.number().required(),
  count: Joi.number().required(),
})
  .and("title", "price", "count")
  .messages({ "object.missing": "title and price and count are required" });
