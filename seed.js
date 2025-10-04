import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/product.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("Define MONGO_URI en tu .env antes de correr seed.js");
  process.exit(1);
}

const products = [
  { title: "Vestido Widy", price: 39000, category: "indumentaria", image: "/img/producto1.jpg" },
  { title: "Vestido Widy", price: 39000, category: "indumentaria", image: "/img/producto2.jpg" },
  { title: "Short Tery Recorte", price: 46000, category: "indumentaria", image: "/img/producto3.jpg" },
  { title: "Campera Kipper Special Relaxed", price: 75000, category: "indumentaria", image: "/img/producto4.jpg" },
  { title: "Bermuda Blast Rot Gabardina Slim fit", price: 59000, category: "indumentaria", image: "/img/producto5.jpg" },
  { title: "Bermuda Flash Slim fit", price: 59000, category: "indumentaria", image: "/img/producto6.jpg" },
  { title: "Colgante 3 en uno -smile", price: 6900, category: "accesorios", image: "/img/producto7.jpg" },
  { title: "Colgante 3 en uno -arandela", price: 7900, category: "accesorios", image: "/img/producto8.jpg" },
  { title: "Colgante 3 en uno -triangulo", price: 6900, category: "accesorios", image: "/img/producto9.jpg" },
  { title: "Pulsera cadena x3", price: 4900, category: "accesorios", image: "/img/producto10.jpg" },
  { title: "Pulsera con dije y perla", price: 4900, category: "accesorios", image: "/img/producto11.jpg" },
  { title: "Set de aros", price: 9900, category: "accesorios", image: "/img/producto12.jpg" },
  { title: "Vestido Strats", price: 59900, category: "indumentaria", image: "/img/producto13.jpg" },
  { title: "Remera Over Eden", price: 36990, category: "indumentaria", image: "/img/producto14.jpg" },
  { title: "Camisa Oslo II", price: 69900, category: "indumentaria", image: "/img/producto15.jpg" },
  { title: "Campera Oruga", price: 128000, category: "indumentaria", image: "/img/producto16.jpg" },
  { title: "Campera Brecker", price: 72000, category: "indumentaria", image: "/img/producto17.jpg" },
  { title: "Campera Shadow", price: 75000, category: "indumentaria", image: "/img/producto18.jpg" }
];

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB Atlas");

    await Product.deleteMany({});
    console.log("🗑️ Productos anteriores eliminados");

    await Product.insertMany(products);
    console.log("✅ Nuevos productos insertados");

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error en seed:", err);
    process.exit(1);
  }
}

run();
