require("dotenv").config();

const redis = require("redis");

const redisClient = redis.createClient(
  // {legacyMode: true}, //availale in v4
  process.env.REDIS_PORT,
  process.env.REDIS_HOST
);

redisClient.auth(process.env.REDIS_PASSWORD);

redisClient.on("connect", () => {
  console.log("Redis client connected");
});

redisClient.on("error", (error) => {
  console.log(error);
});

module.exports = redisClient;
