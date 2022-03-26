const express = require("express");
const permission = require("../middlewares/role.middleware");
const { verifyAccessToken } = require("../middlewares/verifyToken.middleware");
const asyncMiddleware = require("../middlewares/async.middleware");
const router = express.Router({ mergeParams: true });
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  deleteCategory,
  editCategory,
} = require("../controllers/category.controller");

router.route("/").get(asyncMiddleware(getAllCategories));

router
  .route("/")
  .post(
    asyncMiddleware(verifyAccessToken),
    asyncMiddleware(permission("Admin")),
    asyncMiddleware(createCategory)
  );


router.route("/:id").get(asyncMiddleware(getCategoryById));

router
  .route("/:id")
  .put(
    asyncMiddleware(verifyAccessToken),
    asyncMiddleware(permission("Admin")),
    asyncMiddleware(editCategory)
  );

router
  .route("/:id")
  .delete(
    asyncMiddleware(verifyAccessToken),
    asyncMiddleware(permission("Admin")),
    asyncMiddleware(deleteCategory)
  );
module.exports = router;
