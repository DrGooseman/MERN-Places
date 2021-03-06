const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const fs = require("fs");
const deleteFile = require("../util/delete-file");
//const uploadFile = require("upload-file");

const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");

async function getPlaces(req, res, next) {
  let places;
  try {
    places = await Place.find();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not fetch places", 500)
    );
  }

  if (!places)
    return next(
      new HttpError("Something went wrong, could not fetch places", 404)
    );

  res.json({ places: places.map(place => place.toObject({ getters: true })) });
}

async function getPlaceById(req, res, next) {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find a place", 500)
    );
  }

  if (!place)
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );

  res.json({ place: place.toObject({ getters: true }) });
}

async function getPlacesByUser(req, res, next) {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not fetch places.", 500)
    );
  }

  // if (places.length === 0)
  //  return next(
  //    new HttpError("Could not find any places for the provided user.", 404)
  //  );

  res.json({ places: places.map(place => place.toObject({ getters: true })) });
}

async function createPlace(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );

  const { title, description, address } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  //uploadFile(req.file, req.fule)

  const newPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.key,
    creator: req.userData.userId
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    return next(new HttpError("Place creation failed, please try again.", 500));
  }

  if (!user)
    return next(
      new HttpError("Could not find a user for the provided id.", 404)
    );

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await newPlace.save({ session });
    user.places.push(newPlace);
    await user.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return next(new HttpError("Place creation failed, please try again.", 500));
  }

  res.status(201).json({ place: newPlace });
}

async function updatePlace(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update the place", 500)
    );
  }

  if (!place) return next(new HttpError("Place could not be found.", 404));

  if (place.creator.toString() !== req.userData.userId) {
    return next(new HttpError("You are not allowed to edit this place.", 401));
  }

  place.title = title;
  place.description = description;

  let oldPlaceKey;
  if (req.file) {
    oldPlaceKey = place.image;
    place.image = req.file.key;
  }

  try {
    await place.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update the place", 500)
    );
  }

  if (oldPlaceKey) deleteFile(oldPlaceKey);

  res.status(200).json({ place: place.toObject({ getters: true }) });
}

async function deletePlace(req, res, next) {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete the place", 500)
    );
  }

  if (!place)
    return next(new HttpError("Could not find a place for this id.", 404));

  if (place.creator.id !== req.userData.userId) {
    return next(
      new HttpError("You are not allowed to delete this place.", 401)
    );
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.remove({ session });
    place.creator.places.pull(place);
    await place.creator.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete the place", 500)
    );
  }

  deleteFile(place.image);

  // const imagePath = place.image;

  // fs.unlink(imagePath, err => {
  //   console.log(err);
  // });

  res.status(200).json({ message: "Place deleted." });
}

exports.getPlaces = getPlaces;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUser = getPlacesByUser;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
