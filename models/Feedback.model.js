const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FeedbackSchema = mongoose.Schema(
  {
    comment: {
      type: String,
    },
    ratingStar: {
      type: Number,
      min: 1,
      max: 5,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderDetail: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "OrderDetail",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Feedback", FeedbackSchema, "Feedback");
