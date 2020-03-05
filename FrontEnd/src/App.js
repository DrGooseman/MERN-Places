import React, { useState, useCallback, useEffect } from "react";
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

let logoutTimer;

function App() {
  const [token, setToken] = useState();
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState();

  const login = useCallback((uid, token, oldExpirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate =
      oldExpirationDate || new Date(new Date().getTime + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token,
        expiration: tokenExpirationDate.toISOString()
      })
    );
  });

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    localStorage.removeItem(userData);
  });

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else clearTimeout(logoutTimer);
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    )
      login(storedData.userId, storedData.token);
  }, [login]);

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
