const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const fs = require("fs");

const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");

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

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const newPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator
  });

  let user;
  try {
    user = await User.findById(creator);
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

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update the place", 500)
    );
  }

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

  const imagePath = place.image;

  fs.unlink(imagePath, err => {
    console.log(err);
  });

  res.status(200).json({ message: "Place deleted." });
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUser = getPlacesByUser;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
