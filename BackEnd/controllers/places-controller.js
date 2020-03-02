const uuid = require("uuid/v4");
const HttpError = require("../models/http-error");

let DUMMY_PLACES = [
  {
    id: "1",
    title: "New York City",
    description: "The city that never sleeps!",
    location: { lat: 40.748, lng: -73.987 },
    creator: "1"
  }
];

function getPlaceById(req, res, next) {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find(p => p.id === placeId);
  if (!place)
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );

  res.json({ place });
}

function getPlacesByUser(req, res, next) {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter(p => p.creator === userId);
  if (places.length === 0)
    return next(
      new HttpError("Could not find any places for the provided user.", 404)
    );

  res.json({ places });
}

function createPlace(req, res, next) {
  const { title, description, coordinates, address, creator } = req.body;
  const newPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator
  };
  DUMMY_PLACES.push(newPlace);

  res.status(201).json({ place: newPlace });
}

function updatePlace(req, res, next) {
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) };

  if (Object.keys(updatedPlace).length === 0)
    return next(new HttpError("Place could not be found", 404));

  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
  updatedPlace.Place.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
}

function deletePlace(req, res, next) {
  const placeId = req.params.pid;

  if (!DUMMY_PLACES.find(p => p.id === placeId))
    return next(new HttpError("Place could not be found", 404));

  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);

  res.status(200).json({ message: "Place deleted." });
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUser = getPlacesByUser;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
