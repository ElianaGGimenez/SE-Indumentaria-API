import { Router } from "express";
import fs from "fs";

const router = Router();

const productsFilePath = "./src/data/products.json";
let products = [];

try {
  const data = fs.readFileSync(productsFilePath, "utf-8");
  products = JSON.parse(data);
} catch (error) {
  console.error("❌ Error al leer products.json:", error);
}

router.get("/", (req, res) => {
  res.json(products);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(product);
});

export default router;
