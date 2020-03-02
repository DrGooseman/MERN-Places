const express = require("express");

const {
  getPlaceById,
  getPlacesByUser,
  createPlace,
  updatePlace,
  deletePlace
} = require("../controllers/places-controller");

const router = express.Router();

router.get("/:pid", getPlaceById);
router.get("/user/:uid", getPlacesByUser);
router.post("/", createPlace);
router.post("/:pid", updatePlace);
router.delete("/:pid", deletePlace);

module.exports = router;
