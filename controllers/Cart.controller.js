const Cart = require("../models/Cart.model");
const Product = require("../models/Product.model");
const ResponseError = require("../helpers/ResponseError");
const { HttpStatus, ResponseEntity, Message } = require("../dto/dataResponse");

/*  
  method: POST
  body: { productId, quantity } 
*/
module.exports.addToCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId, quantity } = req.body;

    if (!(productId && quantity)) {
      return next(new ResponseError(400, "Lack of information"));
    }

    if(quantity === 0) {
      return next(new ResponseError(400, "Quantity must bigger than 0"));
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

      res
        .status(HttpStatus.OK)
        .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, cart));
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
  } catch (error) {
    console.log(error);
  }
};

/*  
  method: GET
  path: ../count
*/
module.exports.getCount = async (req, res, next) => {
  try {
    const userId = req.userId;

    const carts = await Cart.find({ user: userId });
    // console.log("get count cart called!");
    res
      .status(HttpStatus.OK)
      .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, carts.length));
  } catch (error) {
    console.log(error);
  }
};

/*  
  method: GET
  path: ../
*/
module.exports.getAll = async (req, res, next) => {
  const userId = req.userId;

  const carts = await Cart.find({ user: userId }).populate("product");

  res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, carts));
};
/* 
  method: GET
  params: userId
*/
module.exports.getCartByUserId = async (req, res, next) => {
  try {
    // console.log("get cart by user id called");
    const userId = req.userId;

    const carts = await Cart.find({ user: userId }).populate('product');

    res
      .status(HttpStatus.OK)
      .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, carts));
  } catch (error) {
    console.log(error);
  }
};

/* 
  method: DELETE
  params: id
*/
module.exports.deleteCartById = async (req, res, next) => {
  const userId = req.userId;
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
  body: { productId, quantity }
  method: PUT
*/
module.exports.updateCart = async (req, res, next) => {
  const userId = req.userId;
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
  const userId = req.userId;

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
