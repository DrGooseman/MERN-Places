const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
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

exports.getPlaceById = getPlaceById;
exports.getPlacesByUser = getPlacesByUser;
