const User = require("../models/User.model");
const { ResponseEntity, HttpStatus, Message } = require("../dto/dataResponse");
const ResponseError = require("../helpers/ResponseError");

/* 
  method: GET 
*/
module.exports.getAllUsers = async (req, res) => {
  const users = await User.find();

  if (!users.length) {
    return res
      .status(HttpStatus.NO_CONTENT)
      .json(new ResponseEntity(HttpStatus.NO_CONTENT, Message.NO_CONTENT));
  }

  res
    .status(HttpStatus.Ok)
    .json(new ResponseEntity(HttpStatus.Ok, Message.SUCCESS, users));
};

/*
  method: GET
  params: userId
*/
module.exports.getUserById = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (!user) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(
        new ResponseEntity(
          HttpStatus.NOT_FOUND,
          `User not found by id: ${userId}`
        )
      );
  }
  res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, user));
};

/*
  params: username
  method: GET
*/
module.exports.getUserByUsername = async (req, res) => {
  const { username } = req.params;
  const user = await User.find({ username: username });
  if (!user) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(
        new ResponseEntity(
          HttpStatus.NOT_FOUND,
          `User not found by id: ${userId}`
        )
      );
  }

  res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, user));
};

/*
  method: POST
  body: { username, password, email, name, phoneNumber, address }
*/
module.exports.createNewUser = async (req, res, next) => {
  try {
    const user = new User(req.body);

    if (
      !(
        user.username &&
        user.email &&
        user.password
      )
    )
      return next(new ResponseError(400, "Missing information"));

    // is email taken
    const emailTaken = await User.findOne({ email });
    if (emailTaken) return next(new ResponseError(400, "Email is taken"));

    // is username taken
    const userExist = await User.findOne({ username });
    if (userExist) return next(new ResponseError(400, "Username is taken"));

    const newUser = await user.save();
    res
      .status(HttpStatus.CREATED)
      .json(new ResponseEntity(HttpStatus.CREATED, Message.SUCCESS, newUser));
  } catch (error) {
    console.log(error);
  }
};

/*
  method: PUT
  params: userId
  body: { username, password, email, name, phoneNumber, address }
*/
module.exports.editUser = async (req, res) => {
  const { userId } = req.params;
  const userBody = { ...req.body };

  if (userBody.username) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json(
        new ResponseEntity(HttpStatus.BAD_REQUEST, "Cannot change username")
      );
  }

  const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json(new ResponseEntity(HttpStatus.NOT_FOUND, Message.ERROR));
  }

  return res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, user));
};

/*
  method: DELETE
  params: userId
*/
module.exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findOneAndDelete({ _id: userId }).select("-password");

  return res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, user));
};
