import { elements, elementString } from "./views/base";
import * as adminViews from "./views/adminViews";
import axios from "axios";

const state = {
  operation: "",
  clicked: 0
};

/*
 * Send post request to /logout endpoint
 */
const logoutPost = async () => {
  const cookie = document.cookie;
  if (cookie) {
    await axios.post("/logout");
  }
};

// Handling the login/register button click
["hashchange", "load"].forEach(() => {
  const pathName = window.location.pathname;
  if (pathName === "/") {
    logoutPost();
    elements.admin.addEventListener("click", e => {
      if (state.clicked !== 1) {
        if (e.target.matches(".btn__login")) {
          adminViews.addBackdrop();
          adminViews.formBuilder("login");
          state.operation = "login";
          state.clicked = 1;
        } else if (e.target.matches(".btn__register")) {
          adminViews.addBackdrop();
          adminViews.formBuilder("register");
          state.operation = "register";
          state.clicked = 1;
        }
      }
    });
  }
});

// Handling exit
elements.backdrop.addEventListener("click", e => {
  if (e.target.matches(".backdrop")) {
    adminViews.cleanUpForm();
    cleanState();
  }
});

// Handling submit button
window.addEventListener("click", e => {
  if (e.target.matches(".btn__submit")) {
    controlPost();
  }
});

const controlPost = async () => {
  const operation = state.operation;
  const username = document.querySelector(elementString.usernameInput).value;
  const password = document.querySelector(elementString.passwordInput).value;

  // Make the respective POST request
  if (username && password) {
    if (operation === "login") {
      await loginPost(username, password);
    } else if (operation === "register") {
      if (checkPassword(password)) {
        await registerPost(username, password);
      } else {
        console.log("failed");
        alert("PASSWORD DOES NOT MATCH");
        adminViews.clearInput(state.operation);
      }
    }
  } else {
    alert("Please fill in the form!");
  }
};

// /*
//  * Get JWT token
//  */
// const authPost = async (username = "", password = "") => {
//   let resp;
//   const result = await axios.post("/auth", {
//     username,
//     password
//   });

//   // Log the response and status code
//   console.log(result.status);
//   console.log(result.data);

//   // Verify the result
//   if (result.status >= 200 && result.status < 400) {
//     // Save the access token to session storage
//     alert("Auth success!");
//     const access_token = result.data.access_token;
//     axios.defaults.headers.common["Authorization"] = `JWT ${access_token}`;
//     resp = true;
//   } else {
//     // Failed to authenticate notice
//     alert("Auth failed!");
//     adminViews.clearInput("login");
//     resp = false;
//   }
//   return resp;
// };

/*
 * Send post request to /login endpoint
 */
const loginPost = async (username = "", password = "") => {
  const cookie = document.cookie;
  if (cookie === "") {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    const result = await axios.post("/login", formData);
    if (result.status >= 200 && result.status <= 300) {
      window.location.href = "/user";
    } else {
      console.log(result);
      alert("Login Failed!");
    }
  } else {
    window.location.href = "/user";
  }
};

/*
 * Send post request to /register endpoint
 */
const registerPost = async (username = "", password = "") => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/register");
  xhr.send(formData);
  xhr.onload = event => {
    if (event.target.status > 400) {
      alert("Registration failed!");
      adminViews.clearInput("register");
    } else {
      alert("Registration success!");
      adminViews.cleanUpForm();
      cleanState();
    }
    console.log(event.target.status);
    console.log(event.target);
  };
};

/*
 * Counter check the password and the reenter password
 */
const checkPassword = password =>
  password === document.querySelector(elementString.repassInput).value
    ? true
    : false;

/*
 * Reset the state
 */
const cleanState = () => {
  state.operation = "";
  state.clicked = 0;
};
