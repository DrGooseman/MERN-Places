const uuid = require("uuid/v4");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const User = require("../models/user");

async function getUsers(req, res, next) {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(new HttpError("Fetching users failed, please try again.", 500));
  }

  res.json({ users: users.map(user => user.toObject({ getters: true })) });
}

async function signUp(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );

  const { username, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError("User creation failed, please try again.", 500));
  }

  if (existingUser)
    return next(new HttpError("User with this email already exists.", 422));

  const newUser = new User({
    username,
    email,
    password,
    image: req.file.path,
    places: []
  });

  try {
    await newUser.save();
  } catch (err) {
    return next(new HttpError("User creation failed, please try again.", 500));
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
}

async function login(req, res, next) {
  const { email, password } = req.body;

  let foundUser;
  try {
    foundUser = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError("Login failed, please try again later.", 500));
  }

  if (!foundUser || foundUser.password != password)
    return next(new HttpError("Email or password is incorrect.", 401));

  res.json({
    message: "Logged in!",
    user: foundUser.toObject({ getters: true })
  });
}

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
