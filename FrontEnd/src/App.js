import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UpdatePlace from "./places/pages/UpdatePlace";
import Login from "./user/pages/Login";
import { AuthContext } from "./shared/context/auth-context";

function App() {
  const [token, setToken] = useState();
  const [userId, setUserId] = useState();

  const login = useCallback((uid, token) => {
    setToken(token);
    setUserId(uid);
  });
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
  });

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>{" "}
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>{" "}
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        {" "}
        <Route path="/" exact>
          <Users />
        </Route>{" "}
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>{" "}
        <Route path="/login" exact>
          <Login />
        </Route>{" "}
        <Redirect to="/login" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, token, userId, login, logout }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
