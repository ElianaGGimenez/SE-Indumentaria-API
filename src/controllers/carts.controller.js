import fs from "fs/promises";

const cartsPath = "./src/data/carts.json";

export const createCart = async (req, res) => {
  try {
    const carts = JSON.parse(await fs.readFile(cartsPath, "utf8") || "[]");
    const newCart = { id: Date.now(), products: [] };
    carts.push(newCart);
    await fs.writeFile(cartsPath, JSON.stringify(carts, null, 2));
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
};


export const getCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const carts = JSON.parse(await fs.readFile(cartsPath, "utf8") || "[]");
    const cart = carts.find(c => c.id == cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const carts = JSON.parse(await fs.readFile(cartsPath, "utf8") || "[]");
    const cart = carts.find(c => c.id == cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const productInCart = cart.products.find(p => p.product === pid);
    if (productInCart) productInCart.quantity += 1;
    else cart.products.push({ product: pid, quantity: 1 });

    await fs.writeFile(cartsPath, JSON.stringify(carts, null, 2));
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar producto" });
  }
};
