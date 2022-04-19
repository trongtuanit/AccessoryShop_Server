const express = require("express");
const permission = require("../middlewares/role.middleware");
const { verifyAccessToken } = require("../middlewares/verifyToken.middleware");
const asyncMiddleware = require("../middlewares/async.middleware");
const {
  addToCart,
  getAll,
  getCount,
  getCartByUserId,
  deleteCartById,
  updateCart,
  updateCarts,
} = require("../controllers/cart.controller");
const router = express.Router();

router
  .route("/")
  .get(
    asyncMiddleware(verifyAccessToken),
    asyncMiddleware(permission("User")),
    asyncMiddleware(getCartByUserId)
  )
  .post(
    asyncMiddleware(verifyAccessToken),
    asyncMiddleware(permission("User")),
    asyncMiddleware(addToCart)
  )
  .put(
    asyncMiddleware(verifyAccessToken),
   asyncMiddleware( permission("User")),
    asyncMiddleware(updateCarts)
  );

router
  .route("/count")
  .get(
    asyncMiddleware(verifyAccessToken),
    asyncMiddleware(permission("User")),
    asyncMiddleware(getCount)
  );

router
  .route("/:id")
  .delete(
    asyncMiddleware(verifyAccessToken),
    permission("User"),
    asyncMiddleware(deleteCartById)
  );

module.exports = router;
