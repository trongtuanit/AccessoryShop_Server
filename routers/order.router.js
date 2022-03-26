const express = require("express");
const permission = require("../middlewares/role.middleware");
const { verifyAccessToken } = require("../middlewares/verifyToken");
const asyncMiddleware = require("../middlewares/async.middleware");
const router = express.Router();
const {
  addOrder,
  getAllOrders,
  getOrderById,
  getOrderUser,
} = require("../controllers/order.controller");

router.get(
  "/:id",
  asyncMiddleware(verifyAccessToken),
  asyncMiddleware(permission("User")),
  asyncMiddleware(getOrderById)
);

router.get(
  "/user",
  asyncMiddleware(verifyAccessToken),
  asyncMiddleware(permission("User")),
  asyncMiddleware(getOrderUser)
);
router.get(
  "/admin",
  asyncMiddleware(verifyAccessToken),
  asyncMiddleware(permission("User")),
  asyncMiddleware(getAllOrders)
);

router.post(
  "/",
  asyncMiddleware(verifyAccessToken),
  asyncMiddleware(permission("User")),
  asyncMiddleware(addOrder)
);

module.exports = router;
