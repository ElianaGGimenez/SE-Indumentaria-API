import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, default: "" },
  precio: { type: Number, required: true },
  categoria: { type: String, required: true },
  disponibilidad: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },
  img: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
