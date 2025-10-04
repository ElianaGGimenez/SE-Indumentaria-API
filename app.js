// app.js
import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import handlebars from "express-handlebars";
import mongoose from "mongoose";

import productsRouter from './src/routes/product.router.js';
import cartsRouter from "./src/routes/carts.router.js";
import viewsRouter from "./src/routes/views.router.js";
import Product from "./src/models/product.model.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

const app = express();
const server = http.createServer(app);
const io = new IOServer(server);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "src/public")));

// Handlebars
app.engine(
  "handlebars",
  handlebars.engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "src/views/layouts"),
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "src/views"));

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Sockets para realtime products
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("getProducts", async () => {
    const prods = await Product.find().lean();
    socket.emit("updateProducts", prods);
  });

  socket.on("newProduct", async (payload) => {
    try {
      await Product.create(payload);
      const prods = await Product.find().lean();
      io.emit("updateProducts", prods);
    } catch (err) {
      console.error("Socket newProduct err:", err);
      socket.emit("error", "No se pudo crear producto");
    }
  });

  socket.on("deleteProduct", async (id) => {
    try {
      await Product.findByIdAndDelete(id);
      const prods = await Product.find().lean();
      io.emit("updateProducts", prods);
    } catch (err) {
      console.error("Socket deleteProduct err:", err);
      socket.emit("error", "No se pudo eliminar");
    }
  });
});

// Conexión a Mongo y arranque
(async () => {
  try {
    if (!MONGO_URI) {
      console.error("❌ MONGO_URI no está definido en .env");
      process.exit(1);
    }
    await mongoose.connect(MONGO_URI, { dbName: "se_indumentaria" });
    console.log("✅ Conectado a MongoDB");

    server.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err);
    process.exit(1);
  }
})();
