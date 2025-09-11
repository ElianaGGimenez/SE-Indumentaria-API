import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "src/public")));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "src/views"));

app.get("/", (req, res) => {
  const products = JSON.parse(fs.readFileSync(path.join(__dirname,"src/data/products.json"), "utf8"));
  res.render("home", { products });
});

app.get("/realtimeproducts", (req, res) => {
  const products = JSON.parse(fs.readFileSync(path.join(__dirname,"src/data/products.json"), "utf8"));
  res.render("realTimeProducts", { products });
});

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.on("newProduct", (product) => {
    const filePath = path.join(__dirname,"src/data/products.json");
    const products = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const newProd = { id: Date.now(), ...product };
    products.push(newProd);
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    io.emit("updateProducts", products);
  });

  socket.on("deleteProduct", (id) => {
    const filePath = path.join(__dirname,"src/data/products.json");
    let products = JSON.parse(fs.readFileSync(filePath, "utf8"));
    products = products.filter((p) => p.id !== id);
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    io.emit("updateProducts", products);
  });
});

const PORT = 8080;
httpServer.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
