import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from "./../../shared/components/util/validators";
import { useForm } from "./../../shared/components/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "./../../shared/context/auth-context";
import "./PlaceForm.css";

function UpdatePlace() {
  const [loadedPlace, setLoadedPlace] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  const auth = useContext(AuthContext);

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

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        console.log(responseData.place);
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true
            },
            description: {
              value: responseData.place.description,
              isValid: true
            }
          },
          true
        );
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  async function updateSubmitHandler(event) {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value
        }),
        { "Content-Type": "application/json" }
      );
      history.push("/" + auth.userId + "/places");
    } catch (err) {}
  }

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  } else if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could Not Find Place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={updateSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Text"
          validators={[VALIDATOR_REQUIRE()]}
          errorText={"Please enter a valid title"}
          onInput={inputHandler}
          initialValue={loadedPlace.title}
          initialIsValid={true}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_REQUIRE()]}
          errorText={"Please enter a valid description"}
          onInput={inputHandler}
          initialValue={loadedPlace.description}
          initialIsValid={true}
        />
        <Button type="sumbit" disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
      </form>
    </React.Fragment>
  );
}

export default UpdatePlace;
