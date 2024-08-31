import React, { useState } from "react";
import CustomButton, { ButtonType } from "../../components/Button";
import SignInCss from "./SignInPage.module.css";
import CustomInput from "../../components/Input";
import { guestInstance } from "../../utils/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../utils/Users";

const SignInComponent = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [incorrectData, setIncorrectData] = useState(null);

  const onUsernameChange = (event) => {
    console.log(event.target.value);
    setUsername(event.target.value);
    setIncorrectData(null);
  };

  const onPasswordChange = (event) => {
    console.log(event.target.value);
    setPassword(event.target.value);
    setIncorrectData(null);
  };

  function setCookie(name, value, days = 7) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
    localStorage.clear("users");
  }

  const onHandelSubmit = () => {
    guestInstance
      .post("/users", {
        username,
        password,
      })
      .then(async function (response) {
        console.log(response);
        if (response.data) {
          if (response.data.status === "failure") {
            toast.error(response.data.data);
            setIncorrectData(response.data.data);
          } else {
            toast.success(response.data.status);

            setCookie("tokenFromServer", response.data.data);

            const user = await getUsers();
            window.location.reload();
          }
        } else {
          toast.error("Something Went Wrong.");
        }
      })
      .catch(function (error) {
        console.log(error);

        toast.error("Something Went Wrong.");
      });
  };

  return (
    <>
      <div className={SignInCss.mainContainer}>
        <div className={SignInCss.leftContainer}>
          <div className={SignInCss.greetContainer}>
            <h1>
              Hey There! <br />
            </h1>
            <span>Good to see you ...</span>
            <div className={SignInCss.queryLabel}>
              <p>Don't have an account?</p>
            </div>
            
            <div className={SignInCss.buttonWrapper}>
              <CustomButton
                buttonType={ButtonType.SECONDARY}
                className="test"
                isRounded
                text={"Sign Up"}
                onClick={() => {
                  navigate("/register");
                }}
                
              />
            </div>
          </div>
        </div>
        <div className={SignInCss.rightContainer}>
          <div className={SignInCss.labelContainer}>
            <label htmlFor="username">Username: </label>
            <CustomInput
              hint={"Enter your Username"}
              value={username}
              onChange={onUsernameChange}
            />
          </div>
          {incorrectData && (
            <p
              style={{
                color: "red",
                fontSize: "var(--text)",
                fontWeight: 600,
              }}
            >
              {incorrectData}
            </p>
          )}

          <div className={SignInCss.labelContainer}>
            <label htmlFor="password">Password: </label>
            <CustomInput
              hint={"Enter your password"}
              value={password}
              onChange={onPasswordChange}
            />
          </div>
          {incorrectData && (
            <p
              style={{
                color: "red",
                fontSize: "var(--text)",
                fontWeight: 600,
              }}
            >
              {incorrectData}
            </p>
          )}

          <div className={SignInCss.buttonWrapper}>
            <CustomButton
              text={"Login"}
              buttonType={ButtonType.PRIMARY}
              isRounded
              onClick={onHandelSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const SignInPage = () => {
  return (
    <>
      <SignInComponent />
    </>
  );
};

export default SignInPage;
