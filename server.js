const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./configs/database");
const User = require("./models/User.model");
const app = express();

app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet.xssFilter());
app.use(helmet.hidePoweredBy());

connectDB();
require("./models/OrderDetail.model");
const router = require("./routers");
router(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  const countUser = await User.countDocuments({});
  if (!countUser) {
    const newUser = new User({
      username: "admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      phoneNumber: process.env.ADMIN_PHONE_NUMBER,
      address: "Nhổn, Minh Khai, Bắc Từ Liêm, Hà Nội",
      role: "Admin",
    });
    await newUser.save();
    console.log("Created admin account!");
  }
  console.log(`Server is running on port ${PORT}`);
});
