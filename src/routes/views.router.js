// src/routes/views.router.js
import { Router } from "express";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

const router = Router();

// Home -> redirect to /products
router.get("/", (req, res) => {
  res.redirect("/products");
});

// Products list (handlebars) using same pagination params
router.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    let filter = {};
    if (query) {
      const [k, ...rest] = query.split(":");
      const v = rest.join(":");
      if (k && v !== undefined) filter[k] = v === "true" ? true : isNaN(Number(v)) ? v : Number(v);
    }

    const options = { page: Number(page), limit: Number(limit), lean: true };
    if (sort) options.sort = { price: sort === "asc" ? 1 : -1 };

    const result = await Product.paginate(filter, options);

    res.render("products", {
      products: result.docs,
      pagination: {
        totalPages: result.totalPages,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage
      },
      query: req.query
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al renderizar productos");
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).send("Producto no encontrado");
    res.render("productDetail", { product });
  } catch (err) {
    res.status(500).send("Error al mostrar detalle");
  }
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeProducts");
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await Cart.findById(cid).populate("products.product").lean();
    if (!cart) return res.status(404).send("Carrito no encontrado");
    res.render("cart", { cart });
  } catch (err) {
    res.status(500).send("Error al mostrar el carrito");
  }
});

export default router;
