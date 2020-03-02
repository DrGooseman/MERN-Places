const express = require("express");
const { check } = require("express-validator");

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
router.post(
  "/",
  [
    check("title")
      .not()
      .isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address")
      .not()
      .isEmpty()
  ],
  createPlace
);
router.post(
  "/:pid",
  [
    check("title")
      .not()
      .isEmpty(),
    check("description").isLength({ min: 5 })
  ],
  updatePlace
);
router.delete("/:pid", deletePlace);

module.exports = router;
