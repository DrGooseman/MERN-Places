const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const { getUsers, login, signUp } = require("../controllers/users-controller");

router.get("/", getUsers);

router.post(
  "/signup",
  [
    check("username")
      .not()
      .isEmpty(),
    check("email")
      .normalizeEmail()
      .isEmail(),
    check("password").isLength({ min: 6 })
  ],
  signUp
);

router.post("/login", login);

module.exports = router;
