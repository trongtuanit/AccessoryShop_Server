const configuration = require("../configs/configuration");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    name: String,
    username: {
      type: String,
      required: [true, "Requires username"],
      unique: [true, "Duplicate username"],
      lowercase: true,
      match: [/^[a-zA-Z0-9]{4,}$/, "Username must minimum four chars"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Requires password"],
      match: [/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, "Password must minimum six chars, at least one letter, one number"],
      select: false,
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is not valid",
      ],
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, "Phone number is not valid"]
    },
    accountBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    address: String,
    role: String,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (user.password) {
    user.password = bcrypt.hashSync(user.password, configuration.SALT_ROUNDS);
  }
  next();
});

userSchema.pre("findOneAndUpdate", function (next) {
  const _update = { ...this.getUpdate() };

  if (_update.password) {
    _update.password = bcrypt.hashSync(
      _update.password,
      configuration.SALT_ROUNDS
    );
  }

  this.setUpdate(_update);
  next();
});

module.exports = mongoose.model("User", userSchema, "User");
