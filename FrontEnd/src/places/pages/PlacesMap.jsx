import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "./../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import MultiMap from "./../components/MultiMap";
import Maps from "./../../shared/components/UIElements/Map";

function PlacesMap() {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const [loadedUsers, setLoadedUsers] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingCount, setLoadingCount] = useState(-2);
  const [error, setError] = useState();

  useEffect(() => {
    const sendRequestUsers = async () => {
      // setIsLoading((prev)=>prev--);
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + "/users"
        );

        const responseData = await response.json();

        if (!response.ok) throw new Error(responseData.message);
        setLoadedUsers(responseData.users);
      } catch (err) {
        setError(err.message);
      }
      setLoadingCount(prev => prev + 1);
    };
    const sendRequestPlaces = async () => {
      //  setIsLoading((prev)=>prev--);
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + "/places"
        );

        const responseData = await response.json();

        if (!response.ok) throw new Error(responseData.message);
        setLoadedPlaces(responseData.places);
      } catch (err) {
        setError(err.message);
      }
      setLoadingCount(prev => prev + 1);
    };
    sendRequestUsers();
    sendRequestPlaces();
  }, []);

  return (
    <div className="center">
      {loadingCount < 0 && <LoadingSpinner overlay />}
      {loadingCount == 0 && (
        <div className="multi-map-container">
          <MultiMap
            places={loadedPlaces}
            users={loadedUsers}
            center={{ lat: 10, lng: 10 }}
            zoom={3}
          ></MultiMap>
        </div>
      )}
    </div>
  );
}

export default PlacesMap;
