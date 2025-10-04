// seed.js
import mongoose from "mongoose";
import Product from "./src/models/product.model.js";

// 👉 Tus productos
const products = [
  { id: 1, title: "Vestido Widy", price: 39000, category: "indumentaria", image: "/img/producto1.jpg" },
  { id: 2, title: "Vestido Widy", price: 39000, category: "indumentaria", image: "/img/producto2.jpg" },
  { id: 3, title: "Short Tery Recorte", price: 46000, category: "indumentaria", image: "/img/producto3.jpg" },
  { id: 4, title: "Campera Kipper Special Relaxed", price: 75000, category: "indumentaria", image: "/img/producto4.jpg" },
  { id: 5, title: "Bermuda Blast Rot Gabardina Slim fit", price: 59000, category: "indumentaria", image: "/img/producto5.jpg" },
  { id: 6, title: "Bermuda Flash Slim fit", price: 59000, category: "indumentaria", image: "/img/producto6.jpg" },
  { id: 7, title: "Colgante 3 en uno -smile", price: 6900, category: "accesorios", image: "/img/producto7.jpg" },
  { id: 8, title: "Colgante 3 en uno -arandela", price: 7900, category: "accesorios", image: "/img/producto8.jpg" },
  { id: 9, title: "Colgante 3 en uno -triangulo", price: 6900, category: "accesorios", image: "/img/producto9.jpg" },
  { id: 10, title: "Pulsera cadena x3", price: 4900, category: "accesorios", image: "/img/producto10.jpg" },
  { id: 11, title: "Pulsera con dije y perla", price: 4900, category: "accesorios", image: "/img/producto11.jpg" },
  { id: 12, title: "Set de aros", price: 9900, category: "accesorios", image: "/img/producto12.jpg" },
  { id: 13, title: "Vestido Strats", price: 59900, category: "indumentaria", image: "/img/producto13.jpg" },
  { id: 14, title: "Remera Over Eden", price: 36990, category: "indumentaria", image: "/img/producto14.jpg" },
  { id: 15, title: "Camisa Oslo II", price: 69900, category: "indumentaria", image: "/img/producto15.jpg" },
  { id: 16, title: "Campera Oruga", price: 128000, category: "indumentaria", image: "/img/producto16.jpg" },
  { id: 17, title: "Campera Brecker", price: 72000, category: "indumentaria", image: "/img/producto17.jpg" },
  { id: 18, title: "Campera Shadow", price: 75000, category: "indumentaria", image: "/img/producto18.jpg" }
];


const MONGO_URI = "mongodb+srv://eliigimenez_db_user:Eliana26g@cluster0.4m8v72g.mongodb.net/tienda?retryWrites=true&w=majority&appName=Cluster0";

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB Atlas");

    // Limpia la colección antes de insertar
    await Product.deleteMany({});
    console.log("🗑️ Productos anteriores eliminados");

    // Inserta los nuevos
    await Product.insertMany(products);
    console.log("✅ Nuevos productos insertados");

    process.exit();
  } catch (error) {
    console.error("❌ Error en seed:", error);
    process.exit(1);
  }
}

seedDB();
