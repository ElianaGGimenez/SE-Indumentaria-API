import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/se_indumentaria";
  try {
    await mongoose.connect(uri, { dbName: "se_indumentaria" });
    console.log("✅ MongoDB conectado");
  } catch (err) {
    console.error("❌ Error conectando MongoDB:", err);
    process.exit(1);
  }
};
