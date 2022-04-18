const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncMiddleware = require("../middlewares/async.middleware");
const { verifyAccessToken } = require("../middlewares/verifyToken.middleware");
const permission = require("../middlewares/role.middleware");
const {
  getWishListByUserId,
  createWishlist,
  updateWishListById,
  deleteWishListById,
} = require("../controllers/wishlist.controller");

router
  .route("/")
  .get(
    asyncMiddleware(verifyAccessToken),
    permission("User"),
    asyncMiddleware(getWishListByUserId)
  );

router
  .route("/")
  .post(
    asyncMiddleware(verifyAccessToken),
    permission("User"),
    asyncMiddleware(createWishlist)
  );

router
  .route("/:id")
  .put(
    asyncMiddleware(verifyAccessToken),
    permission("User"),
    asyncMiddleware(updateWishListById)
  );

router
  .route("/:id")
  .delete(
    asyncMiddleware(verifyAccessToken),
    permission("User"),
    asyncMiddleware(deleteWishListById)
  );

module.exports = router;
