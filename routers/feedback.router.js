const express = require("express");
const permission = require("../middlewares/role.middleware");
const { verifyAccessToken } = require("../middlewares/verifyToken");
const asyncMiddleware = require("../middlewares/async.middleware");
const router = express.Router({ mergeParams: true });

const {
  createFeedback,
  deleteFeedback,
  editFeedback,
  getAllFeedbacksByOderDetailId,
} = require("../controllers/feedback.controller");

router
  .route("/:order_detail_id")
  .get(asyncMiddleware(getAllFeedbacksByOderDetailId));

router
  .route("/")
  .post(
    asyncMiddleware(verifyAccessToken),
    permission("User"),
    asyncMiddleware(createFeedback)
  );

router
  .route("/:id")
  .put(
    asyncMiddleware(verifyAccessToken),
    permission("User"),
    asyncMiddleware(editFeedback)
  );

router
  .route("/:id")
  .delete(
    asyncMiddleware(verifyAccessToken),
    permission("User"),
    asyncMiddleware(deleteFeedback)
  );

module.exports = router;
