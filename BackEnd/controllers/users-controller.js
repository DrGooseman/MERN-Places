const uuid = require("uuid/v4");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const DUMMY_USERS = [
  {
    id: "1",
    username: "Jim",
    email: "jim@jim.com",
    password: "password"
  }
];

function getUsers(req, res, next) {
  res.json({ users: DUMMY_USERS });
}

function signUp(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );

  const { username, email, password } = req.body;

  const hasUser = DUMMY_USERS.find(u => u.email === email);
  if (hasUser)
    return next(new HttpError("User with this email already exists.", 422));

  const newUser = { id: uuid(), username, email, password };
  DUMMY_USERS.push(newUser);
  res.status(201).json({ user: newUser });
}

function login(req, res, next) {
  const { email, password } = req.body;

  const foundUser = DUMMY_USERS.find(p => p.email === email);

  if (!foundUser || foundUser.password != password)
    return next(new HttpError("Email or password is incorrect.", 401));

  res.json({ message: "Logged in!" });
}

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;