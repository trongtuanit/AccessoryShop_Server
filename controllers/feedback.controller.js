const Feedback = require("../models/Feedback.model");
const { HttpStatus, ResponseEntity, Message } = require("../dto/dataResponse");

module.exports.getAllFeedbacksByOderDetailId = async (req, res) => {
  const orderDetailId = req.params.order_detail_id;
  const feedback = await Feedback.find({ orderDetailId }).populate({
    path: "orderDetail",
    populate: {
      path: "product",
    },
  });
  res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, feedback));
};

module.exports.createFeedback = async (req, res, next) => {
  const userId = req.userId;
  const { comment, ratingStar, order_detail_id } = { ...req.body };

  if (!(comment && ratingStar && order_detail_id && userId))
    return next(new ErrorResponse(400, "Missing information"));

  const feedback = await Feedback.create({
    comment,
    ratingStar,
    orderDetail: order_detail_id,
    user: userId,
  });

  res
    .status(HttpStatus.CREATED)
    .json(new ResponseEntity(HttpStatus.CREATED, Message.SUCCESS, feedback));
};

module.exports.editFeedback = async (req, res, next) => {
  const userId = req.userId;
  const { comment, ratingStar, order_detail_id } = { ...req.body };

  if (!(comment && ratingStar && order_detail_id && userId))
    return next(new ErrorResponse(400, "Missing information"));

  const feedback = await Feedback.create({
    comment,
    ratingStar,
    orderDetail: order_detail_id,
    user: userId,
  });

  res
    .status(HttpStatus.CREATED)
    .json(new ResponseEntity(HttpStatus.CREATED, Message.SUCCESS, feedback));
};

module.exports.deleteFeedback = async (req, res, next) => {
  const feedbackId = req.params.id;
  const feedback = await Feedback.findByIdAndDelete(feedbackId);

  res
    .status(HttpStatus.CREATED)
    .json(new ResponseEntity(HttpStatus.CREATED, Message.SUCCESS, feedback));
};
