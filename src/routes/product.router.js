// src/routes/product.router.js
import { Router } from "express";
import Product from "../models/product.model.js";

const router = Router();

// GET /api/products con paginación, filtros y ordenamiento
router.get("/", async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      sort,
      query
    } = req.query;

    // Filtro (por categoría o status/disponibilidad)
    let filter = {};
    if (query) {
      // query puede ser category=algo o status=true
      const [key, value] = query.split(":");
      if (key && value) filter[key] = value;
    }

    // Opciones de paginación
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort
        ? { price: sort === "asc" ? 1 : -1 }
        : undefined,
      lean: true,
    };

    const result = await Product.paginate(filter, options);

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `${baseUrl}?page=${result.prevPage}&limit=${limit}`
        : null,
      nextLink: result.hasNextPage
        ? `${baseUrl}?page=${result.nextPage}&limit=${limit}`
        : null,
    });
  } catch (err) {
    console.error("Error en GET /api/products:", err);
    res.status(500).json({ status: "error", error: err.message });
  }
});

// Obtener un producto por id
router.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product)
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// Crear producto
router.post("/", async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ status: "error", error: err.message });
  }
});

// Actualizar producto
router.put("/:pid", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.pid,
      req.body,
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ status: "error", error: err.message });
  }
});

// Eliminar producto
router.delete("/:pid", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.pid);
    if (!deleted)
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    res.json({ status: "success", message: "Producto eliminado" });
  } catch (err) {
    res.status(400).json({ status: "error", error: err.message });
  }
});

export default router;
