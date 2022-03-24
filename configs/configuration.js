require("dotenv").config();

module.exports = {
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/accessory_store",
  PORT: process.env.PORT || 3000,
  SALT_ROUNDS: +process.env.SALT_ROUNDS || 5,
  JWT_SECRET: process.env.JWT_SECRET || "abcxyz",
};
