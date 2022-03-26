const authRouter = require("./auth.router");
const cartRouter = require("./cart.router");
const categoryRouter = require("./category.router");
const feedbackRouter = require("./feedback.router");
const orderRouter = require("./order.router");
const productRouter = require("./product.router");
const errorHandle = require("../middlewares/errorHandle");

module.exports = (app) => {
  app.use("/api/auth", authRouter);

  app.use("/api/cart", cartRouter);

  app.use("/api/category", categoryRouter);

  app.use("/api/feedback", feedbackRouter);

  app.use("/api/order", orderRouter);

  app.use("/api/product", productRouter);

  app.use(errorHandle);
}
