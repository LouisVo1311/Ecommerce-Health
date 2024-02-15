const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        selled: { type: Number },
        price: { type: Number, required: true },
        priceImport: { type: Number, required: true },
        origin: { type: String, required: true },
        packaging: { type: String, required: true },
        ingredient: { type: String, required: true },
        description: { type: String },
        certification: { type: String, required: true },
        type: { type: String, required: true },
        supplier: { type: String, required: true },
        address: { type: String, required: true },
        note: { type: String },
        discount: { type: Number },
        exp: { type: String, required: true },
        countInStock: { type: Number, required: true },
        image: { type: String, required: true },
        licence: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
