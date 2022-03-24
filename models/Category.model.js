const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Requires name"],
  },
  description: String,
  thumbnail: String,
});

module.exports = mongoose.model("Category", CategorySchema, "Category");
