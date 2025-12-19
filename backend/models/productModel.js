import mongoose from "mongoose";

// THIS LINE IS THE NUCLEAR FIX — KILLS ALL OLD CACHED MODELS FOREVER
delete mongoose.connection.models["product"];
delete mongoose.models["product"];
mongoose.models = {};

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array, required: true },
    bestSeller: { type: Boolean },
    date: { type: Number, required: true }
});

// Force correct collection name "products" in database "ecommerce"
const productModel = mongoose.model("product", productSchema, "products");

export default productModel;