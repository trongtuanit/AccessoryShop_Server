const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middlewares/async.middleware");
const {
  verifyAccessToken,
  verifyRefreshToken,
  verifyResetToken,
} = require("../middlewares/verifyToken.middleware");
const {
  signUp,
  login,
  logout,
  validateToken,
  resetPassword,
  updateInfomation,
  changePassword,
  getAccessToken,
  confirmToken,
} = require("../controllers/auth.controller");
const permission = require("../middlewares/role.middleware");

router
  .route("/")
  .get(asyncMiddleware(verifyAccessToken), asyncMiddleware(confirmToken));
router
  .route("/")
  .put(asyncMiddleware(verifyAccessToken), asyncMiddleware(permission("User")), asyncMiddleware(updateInfomation));
router
  .route("/password")
  .put(asyncMiddleware(verifyAccessToken), asyncMiddleware(changePassword));
router
  .route("/reset-password/:resetToken")
  .put(asyncMiddleware(verifyResetToken), asyncMiddleware(resetPassword));
router.route("/sign-up").post(asyncMiddleware(signUp));
router.route("/login").post(asyncMiddleware(login));
router
  .route("/logout")
  .get(asyncMiddleware(verifyAccessToken), asyncMiddleware(logout));
router
  .route("/token")
  .post(asyncMiddleware(verifyRefreshToken), asyncMiddleware(getAccessToken));

router.route("/validate").post(asyncMiddleware(validateToken));

module.exports = router;
