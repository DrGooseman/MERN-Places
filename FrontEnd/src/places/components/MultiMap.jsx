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
      var icon = {
        url: getImage(place.creator), // url
        scaledSize: new window.google.maps.Size(50, 50), // scaled size
        size: new window.google.maps.Size(30, 30),
        origin: new window.google.maps.Point(8, 4), // origin
        anchor: new window.google.maps.Point(15, 15)
      };

      new window.google.maps.Marker({
        position: place.location,
        icon,
        map
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
