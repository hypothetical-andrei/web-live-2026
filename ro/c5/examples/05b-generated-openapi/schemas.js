// Folosește schemele Joi pentru validarea intrării și formele OpenAPI generate.
// Normalizarea rămâne cod explicit.
import Joi from "joi";

export const createTaskSchema = Joi.object({
  title: Joi.string()
    .pattern(/\S/)
    .required()
    .description("Titlu cu text; spațiile de la capete sunt eliminate după validare."),
})
  .unknown(false)
  .required();

export const createdTaskSchema = Joi.object({
  data: Joi.object({ id: Joi.string().required(), title: Joi.string().required() })
    .unknown(false)
    .required(),
})
  .unknown(false)
  .required();

export const errorSchema = Joi.object({
  error: Joi.object({ code: Joi.string().required() }).unknown(false).required(),
})
  .unknown(false)
  .required();
