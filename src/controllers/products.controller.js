import products from "../data/products.js";

export const getProducts = (req, res) => {
  res.json(products);
};

export const getProductById = (req, res) => {
  const { id } = req.params;
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  res.json(product);
};

export const getProductsByCategory = (req, res) => {
  const { category } = req.params;
  const filtered = products.filter(
    (p) => p.categoria.toLowerCase() === category.toLowerCase()
  );

  if (filtered.length === 0) {
    return res.status(404).json({ message: "No hay productos en esta categoría" });
  }

  res.json(filtered);
};
