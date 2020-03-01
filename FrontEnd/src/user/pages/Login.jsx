import React, { useState, useContext } from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL
} from "../../shared/components/util/validators";
import { useForm } from "../../shared/components/hooks/form-hook";
import "./Auth.css";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "./../../shared/context/auth-context";

function Login() {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
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
        { ...formState.inputs, username: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    else
      setFormData(
        { ...formState.inputs, username: { value: "", isValid: false } },
        false
      );
    setIsLoginMode(prevMode => !prevMode);
  }

  function loginSubmitHandler(event) {
    event.preventDefault();
    console.log(formState.inputs);
    auth.login();
  }

  return (
    <Card className="authentication">
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
          type="text"
          label="Password"
          element="input"
          validators={[VALIDATOR_MINLENGTH(5)]}
          onInput={inputHandler}
          errorText="Please enter a valid password (at least 5 characters)."
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
  );
}

export default Login;
