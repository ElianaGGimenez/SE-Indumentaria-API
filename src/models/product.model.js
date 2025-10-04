import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: Boolean, default: true }
});

productSchema.plugin(mongoosePaginate);

export default mongoose.model("Product", productSchema);
