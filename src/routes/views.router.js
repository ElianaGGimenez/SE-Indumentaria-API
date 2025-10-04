// src/routes/views.router.js
import { Router } from "express";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

const router = Router();

// Paginated products view
router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const p = Math.max(1, parseInt(page));
    const lim = Math.max(1, parseInt(limit));
    const total = await Product.countDocuments();
    const totalPages = Math.max(1, Math.ceil(total / lim));
    const products = await Product.find()
      .skip((p - 1) * lim)
      .limit(lim)
      .lean();

    res.render("index", {
      products,
      page: p,
      totalPages,
      hasPrevPage: p > 1,
      hasNextPage: p < totalPages,
      prevPage: p > 1 ? p - 1 : null,
      nextPage: p < totalPages ? p + 1 : null
    });
  } catch (err) {
    res.status(500).send("Error rendering products");
  }
});

// Product detail page
router.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).send("Producto no encontrado");
    res.render("productDetail", { product });
  } catch (err) {
    res.status(500).send("Error detail");
  }
});

// Realtime products page
router.get("/realtimeproducts", async (req, res) => {
  const products = await Product.find().lean();
  res.render("realTimeProducts", { products });
});

// Cart view
router.get("/carts/:cid", async (req, res) => {
  const cart = await Cart.findById(req.params.cid).populate("products.product").lean();
  if (!cart) return res.status(404).send("Carrito no encontrado");
  res.render("cart", { cart });
});

// Root -> redirect to products page
router.get("/", (req, res) => {
  res.redirect("/products");
});

export default router;
