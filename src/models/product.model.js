export function validateNewProduct(body) {
  const required = ["title", "description", "code", "price", "stock", "category"];
  const missing = required.filter(k => body[k] === undefined);
  if (missing.length) {
    return { ok: false, message: `Faltan campos: ${missing.join(", ")}` };
  }
  if (typeof body.price !== "number" || body.price < 0) {
    return { ok: false, message: "price debe ser número >= 0" };
  }
  if (typeof body.stock !== "number" || body.stock < 0) {
    return { ok: false, message: "stock debe ser número >= 0" };
  }
  return { ok: true };
}
