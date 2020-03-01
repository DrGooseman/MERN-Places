import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from "./../../shared/components/util/validators";
import { useForm } from "./../../shared/components/hooks/form-hook";
import "./PlaceForm.css";
import Card from "../../shared/components/UIElements/Card";

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

function UpdatePlace() {
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false
      },
      description: {
        value: "",
        isValid: false
      }
    },
    true
  );

  const placeId = useParams().placeId;
  const place = DUMMY_PLACES.find(p => p.id === placeId);
  useEffect(() => {
    if (place) {
      setFormData(
        {
          title: {
            value: place.title,
            isValid: true
          },
          description: {
            value: place.description,
            isValid: true
          }
        },
        true
      );
    }
  }, [setFormData, place]);

  function updateSubmitHandler(event) {
    event.preventDefault();
    console.log(formState.inputs);
  }

  if (!place)
    return (
      <div className="center">
        <Card>
          <h2>Could Not Find Place!</h2>
        </Card>
      </div>
    );

  if (!formState.inputs.title.value)
    return (
      <div className="center">
        <h2>Loading...</h2>;
      </div>
    );

  return (
    <form className="place-form" onSubmit={updateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Text"
        validators={[VALIDATOR_REQUIRE()]}
        errorText={"Please enter a valid title"}
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialIsValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_REQUIRE()]}
        errorText={"Please enter a valid description"}
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialIsValid={formState.inputs.description.isValid}
      />
      <Button type="sumbit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
}

export default UpdatePlace;
