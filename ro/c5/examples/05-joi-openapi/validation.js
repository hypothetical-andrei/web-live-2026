// Verifică aceleași reguli manual și cu Joi, apoi descrie operația HTTP pentru
// instrumente externe. Urmărește respingerea, normalizarea și valoarea returnată; OpenAPI
// nu instalează middleware.
import Joi from "joi";

export function validateManually(body) {
  if (body === null || typeof body !== "object" || Array.isArray(body))
    return { ok: false };
  if (Object.keys(body).some((key) => key !== "title")) return { ok: false };
  if (typeof body.title !== "string" || body.title.trim() === "") return { ok: false };
  return { ok: true, value: { title: body.title.trim() } };
}

export const createTaskSchema = Joi.object({
  title: Joi.string().required(),
})
  .unknown(false)
  .required();

export function validateWithJoi(body) {
  const { error, value } = createTaskSchema.validate(body, {
    convert: false,
    abortEarly: false,
  });
  if (error) return { ok: false };
  // Verifică mai întâi tipul; normalizează doar un șir confirmat.
  const title = value.title.trim();
  if (title === "") return { ok: false };
  return { ok: true, value: { title } };
}
