const express = require("express");
const { check } = require("express-validator");

const checkAuth = require("../middleware/check-auth");
const fileUpload = require("../middleware/file-upload");

const {
  getPlaces,
  getPlaceById,
  getPlacesByUser,
  createPlace,
  updatePlace,
  deletePlace
} = require("../controllers/places-controller");

const router = express.Router();

router.get("/", getPlaces);
router.get("/:pid", getPlaceById);
router.get("/user/:uid", getPlacesByUser);

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single("image"),
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
router.patch(
  "/:pid",
  fileUpload.single("image"),

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
