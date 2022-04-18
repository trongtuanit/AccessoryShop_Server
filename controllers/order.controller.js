const ResponseError = require("../helpers/ResponseError");
const { HttpStatus, ResponseEntity, Message } = require("../dto/dataResponse");
const Order = require("../models/Order.model");
const OrderDetail = require("../models/OrderDetail.model");
const User = require("../models/User.model");
const Cart = require("../models/Cart.model");
const mongoose = require("mongoose");
const Product = require("../models/Product.model");


/*
  method: GET
  params: userId
  body: { address, phoneNumber, carts }
*/
module.exports.addOrder = async (req, res, next) => {
  const userId = req.userId;
  const { address, phoneNumber, carts } = req.body;

  if (!(address && phoneNumber && carts)) {
    return next(
      new ResponseError(HttpStatus.BAD_REQUEST, "Missing information")
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const options = { session };

    const user = await User.findOne({ _id: userId }, null, options);
    if (!user) {
      await session.abortTransaction();
      session.endSession();

      return next(new ResponseError(HttpStatus.NOT_FOUND, "User not found"));
    }

    // Check for existing product in user's cart and delete them
    const productsInCart = await Promise.all(
      carts.map(async (cartId) => {
        const cart = await Cart.findOneAndDelete(
          { _id: cartId, user: userId },
          options
        ).populate("product");

        const product = await Product.findById(cart.product._id, null, options);
        product.sold += cart.quantity;
        await product.save();

        return cart;
      })
    );

    const totalAmount = productsInCart.reduce((total, cart) => {
      const { quantity, product } = cart;
      const { price, discount } = product;

      return total + quantity * (price * ((100 - discount) / 100));
    }, 0);

    // Check user's account balance
    if (user.accountBalance < totalAmount) {
      await session.abortTransaction();
      session.endSession();

      return next(
        new ResponseError(
          HttpStatus.BAD_REQUEST,
          "User's account balance is not enough for payment"
        )
      );
    }

    const order = await Order.create(
      [
        {
          address,
          phoneNumber,
          amount: totalAmount,
          user: userId,
        },
      ],
      options
    );

    const newOrder = order[0];

    user.accountBalance -= totalAmount;
    await user.save();

    // Transfer money to recipient's account
    const receiver = await User.findOne({ username: "admin" }, null, options);

    if (!receiver) {
      await session.abortTransaction();
      session.endSession();

      return next(
        new ResponseError(HttpStatus.BAD_REQUEST, "Receiver not found")
      );
    }

    receiver.accountBalance += totalAmount;
    await receiver.save();

    // Create array detail of order
    const orderDetailArray = productsInCart.map((cart) => {
      return {
        discount: cart.product.discount,
        price: cart.product.price,
        quantity: cart.quantity,
        order: newOrder._id,
        product: cart.product._id,
      };
    });

    const orderDetails = await OrderDetail.insertMany(
      orderDetailArray,
      options
    );

    // End session
    await session.commitTransaction();
    session.endSession();

    res.status(HttpStatus.OK).json(
      new ResponseEntity(HttpStatus.OK, Message.SUCCESS, {
        order: newOrder,
        orderDetails,
      })
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(new ResponseError(HttpStatus.BAD_REQUEST, error.message));
  }
};


/*
  params: userId
  method: GET
*/
module.exports.getOrderUser = async (req, res) => {
  const userId = req.userId;

  const orders = await Order.find({ user: userId })
    .populate({ path: "orderDetail", populate: "product" })
    .populate("user");

  res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK), Message.SUCCESS, orders);
};


/*
  method: GET
*/
module.exports.getAllOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate({ path: "orderDetail", populate: "product" })
    .populate("user");

  res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK), Message.SUCCESS, orders);
};

/*
  method: GET
  params: orderId
*/
module.exports.getOrderById = async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId)
    .populate({ path: "orderDetail", populate: "product" })
    .populate("user");

  if (!order)
    return next(new ResponseError(HttpStatus.NOT_FOUND, "Not found order"));

  res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK), Message.SUCCESS, order);
};
