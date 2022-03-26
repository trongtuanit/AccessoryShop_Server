const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Requires name"],
    unique: [true, "Duplicate username"],
    trim: true,
  },
  image: [String],
  description: String,
  price: {
    type: Number,
    min: 0,
  },
  stock: {
    type: Number,
    min: 0,
    default: 0,
  },
  discount: {
    type: Number,
    min: 0,
    max: 90,
    default: 0,
  },
  slug: String,
  sold: {
    type: Number,
    min: 0,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
});

module.exports = mongoose.model("Product", productSchema, "Product");
