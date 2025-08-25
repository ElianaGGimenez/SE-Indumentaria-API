import express from "express";
import productsRouter from "./src/routes/products.router.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("🚀 Bienvenido al servidor de productos. Usa /api/products para acceder a los datos.");
});

app.use("/api/products", productsRouter);

app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
