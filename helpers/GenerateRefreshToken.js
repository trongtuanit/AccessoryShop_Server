require("dotenv").config();
const redisClient = require("../configs/redis");
const jwt = require("jsonwebtoken");
const ResponseError = require("./ResponseError");

const generateRefreshToken = (userId) => {
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
  });

  redisClient.set(userId.toString(), refreshToken, function (error) {
    if (error) return next(new ResponseError(400, error.message));

    console.log("Stored refresh token");
  });

  return refreshToken;
};

module.exports = generateRefreshToken;
