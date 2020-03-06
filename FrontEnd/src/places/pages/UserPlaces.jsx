import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "./../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

function UserPlaces() {
  const auth = useContext(AuthContext);
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (err) {}
    };
    fetchPlaces();
  }, []);

  function deletePlaceHandler(deletedPlaceId) {
    setLoadedPlaces(prevPlaces =>
      prevPlaces.filter(place => place.id !== deletedPlaceId)
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList
          onDeletePlace={deletePlaceHandler}
          items={loadedPlaces.filter(place => place.creator === userId)}
          isCurrentUser={auth.userId === userId}
        />
      )}
    </React.Fragment>
  );
}

export default UserPlaces;
