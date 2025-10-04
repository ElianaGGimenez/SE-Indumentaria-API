import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const createCart = async (req, res) => {
  try {
    const cart = await Cart.create({ products: [] });
    res.status(201).json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await Cart.findById(cid).populate("products.product").lean();
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    res.json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

    const existing = cart.products.find(p => p.product.toString() === pid);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    const populated = await cart.populate("products.product").execPopulate?.() || await Cart.findById(cid).populate("products.product").lean();
    res.json({ status: "success", payload: populated });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    const populated = await Cart.findById(cid).populate("products.product").lean();
    res.json({ status: "success", payload: populated });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const replaceCartProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const productsArray = req.body.products;
    if (!Array.isArray(productsArray)) return res.status(400).json({ status: "error", message: "products debe ser un arreglo" });

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    cart.products = productsArray.map(p => ({ product: p.product, quantity: p.quantity || 1 }));

    await cart.save();
    const populated = await Cart.findById(cid).populate("products.product").lean();
    res.json({ status: "success", payload: populated });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (typeof quantity !== "number") return res.status(400).json({ status: "error", message: "quantity debe ser un número" });

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    const existing = cart.products.find(p => p.product.toString() === pid);
    if (!existing) return res.status(404).json({ status: "error", message: "Producto no encontrado en el carrito" });

    existing.quantity = quantity;
    await cart.save();

    const populated = await Cart.findById(cid).populate("products.product").lean();
    res.json({ status: "success", payload: populated });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const emptyCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    cart.products = [];
    await cart.save();
    res.json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};
