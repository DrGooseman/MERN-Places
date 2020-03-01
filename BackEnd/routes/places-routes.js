const express = require("express");

const {
  getPlaceById,
  getPlacesByUser
} = require("../controllers/places-controller");

const router = express.Router();

router.get("/:pid", getPlaceById);
router.get("/user/:uid", getPlacesByUser);

module.exports = router;
