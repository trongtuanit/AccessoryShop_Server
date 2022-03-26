const express = require("express");
const permission = require("../middlewares/role.middleware");
const { verifyAccessToken } = require("../middlewares/verifyToken.middleware");
const asyncMiddleware = require("../middlewares/async.middleware");
const router = express.Router({ mergeParams: true });
const {
  createNewProduct,
  createNewProductWithImage,
  deleteProduct,
  editProductById,
  getAllProducts,
  getProductById,
  getAllSortedProducts,
  getTop10Seller,
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
  );

router.route("/top-10-sellers").get(asyncMiddleware(getTop10Seller));

router.route("/sorted").get(asyncMiddleware(getAllSortedProducts));

router
  .route("/:id")
  .get(asyncMiddleware(getProductById))
  .put(
    asyncMiddleware(verifyAccessToken),
    asyncMiddleware(permission("Admin")),
    asyncMiddleware(editProductById)
  )
  .delete(
    asyncMiddleware(verifyAccessToken),
    asyncMiddleware(permission("Admin")),
    asyncMiddleware(deleteProduct)
  );

module.exports = router;
