const ResponseError = require("../helpers/ResponseError");
const Wishlist = require("../models/Wishlist.model");
const { HttpStatus, ResponseEntity, Message } = require("../dto/dataResponse");

module.exports.getWishListByUserId = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.find({ user: req.userId }).populate(
      "product"
    );

    // console.log("wishlist api called!");
    res
      .status(HttpStatus.OK)
      .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, wishlist));
  } catch (error) {
    console.log(error);
  }
};

module.exports.createWishlist = async (req, res, next) => {
  const userId = req.userId;
  try {
    const wishlist = await Wishlist.create({
      ...req.body,
      userId,
    });
    res
      .status(HttpStatus.OK)
      .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, wishlist));
  } catch (error) {
    console.log(error);
  }
};

module.exports.updateWishListById = async (req, res, next) => {
  const wishlist = await Wishlist.findByIdAndUpdate(req.params.id, req.body);

  res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, wishlist));
};

module.exports.deleteWishListById = async (req, res, next) => {
  const wishlist = await Wishlist.findByIdAndDelete(req.params.id);

  res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, wishlist));
};
