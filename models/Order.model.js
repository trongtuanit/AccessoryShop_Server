const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OrderSchema = mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      match: /^[0][0-9]{9}$/,
      required: [true, "Requires phone number "],
    },
    amount: {
      type: Number,
      min: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Requires user!"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

OrderSchema.virtual("orderDetail", {
  ref: "OderDetail",
  localField: "_id",
  foreignField: "order",
  justOne: false,
});

module.exports = mongoose.model("Order", OrderSchema, "Order");
