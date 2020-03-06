import React, { useRef, useEffect } from "react";

import "./MultiMap.css";

function MultiMap(props) {
  const mapRef = useRef();

  const { center, zoom, places, users } = props;

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom
    });

    places.forEach(place => {
      var infowindow = new window.google.maps.InfoWindow({
        content: `<div class="multi-map-popup"><img class="multi-map-image"
        src=${process.env.REACT_APP_ASSET_URL + place.image}
        alt=${place.title}
      />
      <h1>${place.title}</h1>
      <p>${place.description}</p></div>`
      });

      var icon = {
        url: getImage(place.creator), // url
        scaledSize: new window.google.maps.Size(50, 50), // scaled size
        size: new window.google.maps.Size(30, 30),
        origin: new window.google.maps.Point(8, 4), // origin
        anchor: new window.google.maps.Point(15, 15)
      };

      const marker = new window.google.maps.Marker({
        position: place.location,
        icon,
        map
      });
      marker.addListener("click", function() {
        infowindow.open(map, marker);
      });
    });
  }, [center, zoom]);

  function getImage(userId) {
    let userImage = users.find(user => user.id == userId).image;

    return process.env.REACT_APP_ASSET_URL + userImage;
  }

  return (
    <div
      ref={mapRef}
      className={`multi-map ${props.className}`}
      style={props.style}
    ></div>
  );
}

export default MultiMap;
