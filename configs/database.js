const configuration = require("./configuration");

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(configuration.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (e) {
    console.log(`Error to connect db: ${e.message}`);
  }
};

module.exports = connectDB;
