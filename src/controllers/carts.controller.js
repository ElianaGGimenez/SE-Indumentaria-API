// src/controllers/carts.controller.js
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const createCart = async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json({ status: "success", payload: newCart });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product").lean();
    if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    res.json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });

    const productExists = await Product.findById(pid);
    if (!productExists) return res.status(404).json({ status: "error", error: "Producto no existe" });

    const item = cart.products.find(p => p.product.toString() === pid);
    if (item) item.quantity += 1;
    else cart.products.push({ product: pid, quantity: 1 });

    await cart.save();
    const updated = await Cart.findById(cid).populate("products.product").lean();
    res.json({ status: "success", payload: updated });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updated = await Cart.findByIdAndUpdate(
      cid,
      { $pull: { products: { product: pid } } },
      { new: true }
    ).populate("products.product").lean();
    res.json({ status: "success", payload: updated });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const updateCartProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body; // [{ product: id, quantity }]
    const updated = await Cart.findByIdAndUpdate(cid, { products }, { new: true }).populate("products.product").lean();
    res.json({ status: "success", payload: updated });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    const item = cart.products.find(p => p.product.toString() === pid);
    if (!item) return res.status(404).json({ status: "error", error: "Producto no en carrito" });
    item.quantity = quantity;
    await cart.save();
    const updated = await Cart.findById(cid).populate("products.product").lean();
    res.json({ status: "success", payload: updated });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const updated = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true }).lean();
    res.json({ status: "success", payload: updated });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};
