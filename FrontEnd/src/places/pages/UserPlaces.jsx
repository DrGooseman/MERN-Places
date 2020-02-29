import React from "react";
import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";

const DUMMY_PLACES = [
  {
    id: "1",
    title: "New York City",
    description: "The city that never sleeps!",
    imageURL: "https://picsum.photos/200",
    address: "New York, NY",
    location: { lat: 40.7484405, lng: -73.9878584 },
    creator: "1"
  },
  {
    id: "2",
    title: "New York City",
    description: "The city that never sleeps!",
    imageURL: "https://picsum.photos/200",
    address: "New York, NY",
    location: { lat: 40.7484405, lng: -73.9878584 },
    creator: "2"
  }
];

function UserPlaces() {
  const userID = useParams().userId;
  return (
    <PlaceList items={DUMMY_PLACES.filter(place => place.creator === userID)} />
  );
}

export default UserPlaces;
