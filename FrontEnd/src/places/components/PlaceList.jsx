import React from "react";

import "./PlaceList.css";
import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";

function PlaceList(props) {
  if (props.items.length === 0)
    return (
      <div className="place-list center">
        <Card>
          <h2>No Places Found. Maybe Create One?</h2>
          <button>Share Place</button>
        </Card>
      </div>
    );

  return (
    <ul className="place-list">
      {props.items.map(place => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
        ></PlaceItem>
      ))}
    </ul>
  );
}

export default PlaceList;
