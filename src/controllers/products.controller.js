import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      sort,
      query
    } = req.query;

    let filter = {};
    if (query) {
      const [key, ...rest] = query.split(":");
      const value = rest.join(":");
      if (key && value !== undefined) {
        if (value === "true" || value === "false") filter[key] = value === "true";
        else if (!isNaN(Number(value))) filter[key] = Number(value);
        else filter[key] = value;
      }
    }

    const options = {
      page: Number(page),
      limit: Number(limit),
      lean: true
    };

    if (sort) {
      options.sort = { price: sort === "asc" ? 1 : -1 };
    }

    const result = await Product.paginate(filter, options);

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl || ""}${req.path === "/" ? "" : ""}`;
    const buildLink = (p) => {
      const q = { ...req.query, page: p };
      const params = new URLSearchParams(q).toString();
      return `${req.protocol}://${req.get("host")}${req.baseUrl || ""}/api/products?${params}`;
    };

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.hasPrevPage ? result.prevPage : null,
      nextPage: result.hasNextPage ? result.nextPage : null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await Product.findById(pid).lean();
    if (!product) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    res.json({ status: "success", payload: product });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const body = req.body;
    const newProduct = await Product.create(body);
    res.status(201).json({ status: "success", payload: newProduct });
  } catch (err) {
    res.status(400).json({ status: "error", error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const pid = req.params.pid;
    const body = req.body;
    delete body._id;
    const updated = await Product.findByIdAndUpdate(pid, body, { new: true });
    if (!updated) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    res.json({ status: "success", payload: updated });
  } catch (err) {
    res.status(400).json({ status: "error", error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const pid = req.params.pid;
    const deleted = await Product.findByIdAndDelete(pid);
    if (!deleted) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    res.json({ status: "success", message: "Producto eliminado" });
  } catch (err) {
    res.status(400).json({ status: "error", error: err.message });
  }
};
