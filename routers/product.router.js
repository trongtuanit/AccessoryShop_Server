const express = require("express");
const permission = require("../middlewares/role.middleware");
const { verifyAccessToken } = require("../middlewares/verifyToken");
const asyncMiddleware = require("../middlewares/async.middleware");
const router = express.Router({ mergeParams: true });
const {
  createNewProduct,
  createNewProductWithImage,
  deleteProduct,
  editProductById,
  getAllProducts,
  getProductById,
} = require("../controllers/product.controller");

router
  .route("/")
  .get(asyncMiddleware(getAllProducts))
  .post(
    asyncMiddleware(verifyAccessToken),
    asyncMiddleware(permission("Admin")),
    asyncMiddleware(createNewProduct)
  )
  .post(
    multer().array("image", 5),
    asyncMiddleware(verifyAccessToken),
    asyncMiddleware(permission("Admin")),
    asyncMiddleware(createNewProductWithImage)
  )

module.exports = router;
