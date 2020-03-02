const express = require("express");

const router = express.Router();

const { getUsers, login, signUp } = require("../controllers/users-controller");

router.get("/", getUsers);

router.post("/signup", signUp);

router.post("/login", login);

module.exports = router;
