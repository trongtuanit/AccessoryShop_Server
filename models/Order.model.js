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
      match: /^[0][0-9]{9,}$/,
      required: [true, "Requires phone number"],
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

OrderSchema.virtual("OrderDetail", {
  ref: "OrderDetail",
  localField: "_id",
  foreignField: "order",
  justOne: false,
});

OrderSchema.set('toJSON', {virtuals: true});
OrderSchema.set('toObject', {virtuals: true});

module.exports = mongoose.model("Order", OrderSchema, "Order");
