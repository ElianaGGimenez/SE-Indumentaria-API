import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  code: { type: String, default: "" },
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },
  category: { type: String, required: true },
  thumbnails: { type: [String], default: [] },
  image: { type: String, default: "" } // alternativa
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);

export default mongoose.models.Product || mongoose.model("Product", productSchema);
