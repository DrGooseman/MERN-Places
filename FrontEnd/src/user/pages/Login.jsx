import React, { useState, useContext } from "react";

import LoadingSpinner from "./../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "./../../shared/components/UIElements/ErrorModal";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL
} from "../../shared/components/util/validators";
import { useForm } from "../../shared/components/hooks/form-hook";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "./../../shared/context/auth-context";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import "./Auth.css";

function Login() {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      password: {
        value: "",
        isValid: false
      },
      email: {
        value: "",
        isValid: false
      }
    },
    false
  );

  function switchModeHandler() {
    if (!isLoginMode)
      setFormData(
        { ...formState.inputs, username: undefined, image: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    else
      setFormData(
        {
          ...formState.inputs,
          username: { value: "", isValid: false },
          image: { value: null, isValid: false }
        },
        false
      );
    setIsLoginMode(prevMode => !prevMode);
  }

  async function loginSubmitHandler(event) {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          { "Content-Type": "application/json" }
        );

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("username", formState.inputs.username.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signUp",
          "POST",
          formData
        );

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>{isLoginMode ? "Login Required" : "Create a new account"}</h2>
        <hr />
        <form onSubmit={loginSubmitHandler}>
          {!isLoginMode && (
            <Input
              id="username"
              type="text"
              label="Username"
              element="input"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
              errorText="Please enter a valid username."
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image"
              center
            />
          )}
          <Input
            id="email"
            type="text"
            label="Email"
            element="input"
            validators={[VALIDATOR_EMAIL()]}
            onInput={inputHandler}
            errorText="Please enter a valid email."
          />
          <Input
            id="password"
            type="password"
            label="Password"
            element="input"
            validators={[VALIDATOR_MINLENGTH(6)]}
            onInput={inputHandler}
            errorText="Please enter a valid password (at least 6 characters)."
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "REGISTER"}
          </Button>
        </form>{" "}
        <Button inverse onClick={switchModeHandler}>
          {isLoginMode
            ? "Dont have an account? Sign up here."
            : "Already have an account? Login here."}
        </Button>
      </Card>
    </React.Fragment>
  );
}

export default Login;
