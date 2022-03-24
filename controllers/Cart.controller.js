const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { HttpStatus, ResponseEntity, Message } = require("../dto/dataResponse");

module.exports.addNewCart = async (req, res, next) => {
  const userId = req.userId;
  const { productId, quantity } = req.body;

  if (!(productId && quantity)) {
    return next(new ErrorResponse(400, "Lack of information"));
  }

  // Check for existing product
  const product = await Product.findOne({ _id: productId });

  if (!product) {
    return next(new ErrorResponse(404, "Not found product"));
  }

  const cart = await Cart.findOne({ user: userId, product: productId });

  if (cart) {
    cart.quantity += quantity;
    await cart.save();

    res.json({
      success: true,
      message: "The product has been added to cart",
      cart,
    });
  } else {
    const newCart = await Cart.create({
      user: userId,
      product: productId,
      quantity,
    });

    res.status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, newCart));
  }
};
