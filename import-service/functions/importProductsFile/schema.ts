import Joi from "joi";

export const schema = Joi.object({
//   queryStringParameters: {
    name: Joi.string().required().messages({
      "string.empty": `"name" cannot be an empty field`,
      "string.base": `"name" should be a type of 'text'`,
      "any.required": `"name" is a required field`,
    }),
//   },
});
