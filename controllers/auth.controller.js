const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SendMail = require("../helpers/SendMail");
const configuration = require("../configs/configuration");
const User = require("../models/User.model");
const { HttpStatus, ResponseEntity, Message } = require("../dto/dataResponse");
const generatePassword = require("../helpers/PasswordGenerator");
const ResponseError = require("../helpers/ResponseError");

/*
  method: GET
  body: { username, password }
*/
module.exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json(new ResponseEntity(HttpStatus.BAD_REQUEST, "Invalid username"));
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json(new ResponseEntity(HttpStatus.BAD_REQUEST, "Invalid password"));
  }

  const token = jwt.sign({ username }, configuration().JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(HttpStatus.OK).json({
    jwt: token,
    userId: user._id,
    username,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
  });
};

/*
  method: POST
  body: { name, username, password, email, phoneNumber }
*/
module.exports.signUp = async (req, res, next) => {
  const user = new User(req.body);

  // check data
  if (
    !(
      user.username &&
      user.email &&
      user.password &&
      user.name &&
      user.phoneNumber
    )
  )
    return next(new ResponseError(400, "Missing information"));

  const emailTaken = await User.findOne({ email });
  if (emailTaken) return next(new ResponseError(400, "Email is taken"));

  const userExist = await User.findOne({ username });
  if (userExist) return next(new ResponseError(400, "Username is taken"));

  const newUser = await user.save();

  res
    .status(HttpStatus.CREATED)
    .json(new ResponseEntity(HttpStatus.CREATED, Message.SUCCESS, newUser));
};

/*
  method: POST
  body : { username, email }
*/
module.exports.resetPassword = async (req, res, next) => {
  if (!email) {
    return next(new ResponseError(400, "Empty email"));
  }
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ResponseError(404, "Not found user with this email"));
  }

  const newPassword = generatePassword.getRandomPassword();
  const message = `Here is your new password: ${newPassword}`;
  try {
    await SendMail({
      email: email,
      subject: "Quên mật khẩu",
      message,
    });

    return res
      .status(HttpStatus.OK)
      .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS));
  } catch (err) {
    console.log(`Error send mail: ${err.message}`);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(
        new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR, Message.ERROR)
      );
  }
};

/*
  method: PUT
  params: userId
  body: { fullname, phoneNumber, email, address, money = 0, }
*/
module.exports.updateInfomation = async (req, res, next) => {
  const userId = req.params.userId;
  const user = await User.findById(req.userId).select("-password");

  if (!user) {
    return next(new ResponseError(HttpStatus.NOT_FOUND, "User not exist"));
  }

  const {
    fullname = user.fullname,
    phoneNumber = user.phoneNumber,
    email = user.email,
    address = user.address,
    money = 0,
  } = req.body;

  if (email !== user.email) {
    const userWithEmail = await User.findOne({ email });

    if (userWithEmail)
      return next(new ErrorResponse(400, "This email is taken"));
  }

  user.fullname = fullname;
  user.phoneNumber = phoneNumber;
  user.email = email;
  user.address = address;
  user.accountBalance = user.accountBalance + +money;

  await user.save();

  return res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS, user));
};

/*
  method: POST
  params: userId
  body: { password, newPassword }
*/
module.exports.changePassword = async (req, res, next) => {
  const { password, newPassword } = req.body;
  const userId = req.params.userId;

  if (!(password && newPassword && confirmPassword)) {
    return next(
      new ResponseError(HttpStatus.BAD_REQUEST, "Missing information")
    );
  }

  if (password === newPassword) {
    return next(
      new ResponseError(
        400,
        "The new password must be different from the old password"
      )
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ResponseError(HttpStatus.NOT_FOUND, "User not exist"));
  }
  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid) {
    return next(
      new ResponseError(HttpStatus.BAD_REQUEST, "Incorrect password")
    );
  }
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  user.password = hashedPassword;
  await user.save();

  return res
    .status(HttpStatus.OK)
    .json(new ResponseEntity(HttpStatus.OK, Message.SUCCESS));
};

/*
  method: POST
  body : { jwt }
  desc: check is token valid and return user infomation witch a new token that expired in 7 days
*/
module.exports.validateToken = async (req, res) => {
  const token = req.body.jwt;

  const user = jwt.verify(token, configuration().JWT_SECRET);

  const currentUser = await User.findOne({ username: user.username });

  if (!currentUser) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json(new ResponseEntity(HttpStatus.UNAUTHORIZED, "Invalid token"));
  }

  const newToken = jwt.sign(
    { username: currentUser.username },
    configuration().JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.status(HttpStatus.OK).json({
    jwt: newToken,
    userId: currentUser._id,
    username: currentUser.username,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
  });
};
