// src/controllers/products.controller.js
import Product from "../models/product.model.js";

/**
 * GET /api/products?limit=&page=&sort=&query=
 * query can be:
 *  - categoria:indumentaria
 *  - disponibilidad:true
 *  - free text => search in nombre (partial)
 */
export const getProducts = async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;

    // Build filter
    const filter = {};
    if (query) {
      const parts = String(query).split(":");
      if (parts.length === 2) {
        const key = parts[0];
        let value = parts[1];
        if (value === "true") value = true;
        if (value === "false") value = false;
        filter[key] = value;
      } else {
        filter.nombre = { $regex: query, $options: "i" };
      }
    }

    // Sort by precio if requested
    const sortObj = {};
    if (sort === "asc") sortObj.precio = 1;
    else if (sort === "desc") sortObj.precio = -1;

    const totalDocs = await Product.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(totalDocs / limit));

    const docs = await Product.find(filter)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;
    const q = query ? `&query=${encodeURIComponent(query)}` : "";
    const s = sort ? `&sort=${sort}` : "";

    res.json({
      status: "success",
      payload: docs,
      totalPages,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? `${baseUrl}?limit=${limit}&page=${page - 1}${s}${q}` : null,
      nextLink: hasNextPage ? `${baseUrl}?limit=${limit}&page=${page + 1}${s}${q}` : null
    });
  } catch (err) {
    console.error("getProducts error:", err);
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.pid).lean();
    if (!prod) return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    res.json({ status: "success", payload: prod });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const body = req.body;
    // Ensure required fields exist
    if (!body.nombre || body.precio === undefined || !body.categoria) {
      return res.status(400).json({ status: "error", error: "Faltan campos obligatorios" });
    }
    const created = await Product.create(body);
    res.status(201).json({ status: "success", payload: created });
  } catch (err) {
    res.status(400).json({ status: "error", error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    if (!updated) return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    res.json({ status: "success", payload: updated });
  } catch (err) {
    res.status(400).json({ status: "error", error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const removed = await Product.findByIdAndDelete(req.params.pid);
    if (!removed) return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    res.json({ status: "success", payload: removed });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};
