const configuration = require("../configs/configuration");

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: String,
    username: {
      type: String,
      required: [true, "Requires username"],
      unique: [true, "Duplicate username"],
      lowercase: true,
      match: /^[a-zA-Z0-9]{8,}$/,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Requires password"],
      select: false,
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email does not match",
      ],
    },
    phoneNumber: {
      type: String,
      trim: true,
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
