import Joi from "joi";

export const schema = Joi.object({
  productId: Joi.string().required().messages({
    "string.empty": `"productId" cannot be an empty field`,
    "string.base": `"productId" should be a type of 'text'`,
    "any.required": `"productId" is a required field`,
  }),
});
