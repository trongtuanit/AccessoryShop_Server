const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OrderDetailSchema = mongoose.Schema(
  {
    discount: {
      type: Number,
    },
    price: {
      type: Number,
      required: [true, "Requires price"],
    },
    quantity: {
      type: Number,
      required: [true, "Requires quantity"],
      min: 0,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Requires order"],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

OrderDetailSchema.virtual("amount").get(function () {
  return this.quantity * (this.price - this.price * (this.discount / 100));
});

module.exports = mongoose.model("OrderDetail", OrderDetailSchema, "OrderDetail");
