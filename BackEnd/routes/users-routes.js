const express = require("express");

const router = express.Router();

const DUMMY_USERS = [
  {
    id: "1",
    name: "Jim"
  }
];

router.get("/", (req, res, next) => {
  res.json({ DUMMY_USERS });
});

module.exports = router;
