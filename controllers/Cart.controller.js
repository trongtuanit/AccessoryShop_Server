const Cart = require("../models/Cart");
const Product = require("../models/Product");
const ResponseError = require("../helpers/ResponseError");
const { HttpStatus, ResponseEntity, Message } = require("../dto/dataResponse");

/*  
  method: POST
  params: userId
  body: { productId, quantity } 
*/
module.exports.addToCart = async (req, res, next) => {
  const userId = req.params.userId;
  const { productId, quantity } = req.body;

  if (!(productId && quantity && userId)) {
    return next(new ResponseError(400, "Lack of information"));
  }

  // Check for existing product
  const product = await Product.findOne({ _id: productId });

  if (!product) {
    return next(new ResponseError(404, "Not found product"));
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

    res
      .status(HttpStatus.OK)
      .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, newCart));
  }
};

/* 
  method: GET
  params: userId
*/
module.exports.getCartByUserId = async (req, res, next) => {
  const userId = req.params.userId;

  const carts = await Cart.find({ user: userId }).popuplate("product");

  res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, carts));
};

/* 
  method: DELETE
  params: /:userId/:id 
*/
module.exports.deleteCartByUserIdAndId = async (req, res, next) => {
  const userId = req.params.userId;
  const id = req.params.id;

  const deletedCart = await Cart.findOneAndDelete({ user: userId, _id: id });

  // Check for existing product in user's cart
  if (!deletedCart) {
    return next(
      new ResponseError(
        HttpStatus.NOT_FOUND,
        "Not found product in user's cart"
      )
    );
  }

  res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, deletedCart));
};

/*  
  params: userId 
  body: { productId, quantity }
  method: PUT
*/
module.exports.updateCartByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  const { productId, quantity } = req.body;

  if (!(productId && quantity)) {
    return next(new ResponseError(400, "Lack of information"));
  }

  const updatedCart = await Cart.findOneAndUpdate(
    { user: userId, product: productId },
    { quantity },
    { new: true }
  ).populate("product");

  // Check for existing product in user's cart
  if (!updatedCart) {
    return next(new ResponseError(404, "Not found product in user's cart"));
  }

  res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, updatedCart));
};

/* 
  body: [{ _id, quantity },...] 
  method: PUT
*/
module.exports.updateCarts = async (req, res, next) => {
  const { newCarts } = req.body;
  // const userId = req.params.userId;

  const carts = await Promise.all(
    newCarts.map(async (cart) => {
      if (cart.quantity === 0) {
        await Cart.findByIdAndDelete(cart._id);
        return null;
      } else {
        const newCart = await Cart.findByIdAndUpdate(cart._id, {
          quantity: cart.quantity,
        });
        return newCart;
      }
    })
  );
  res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, carts));
};
