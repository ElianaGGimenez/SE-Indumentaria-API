import CartManager from "../managers/CartManager.js";

const cartManager = new CartManager("./src/data/carts.json");

export async function createCart(req, res) {
  const cart = await cartManager.createCart();
  res.status(201).json(cart);
}

export async function getCart(req, res) {
  const { cid } = req.params;
  const cart = await cartManager.getCartById(cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart);
}

export async function addProductToCart(req, res) {
  const { cid, pid } = req.params;
  const cart = await cartManager.addProductToCart(cid, pid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart);
}
