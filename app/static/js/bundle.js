/*
 * State
 */
const state = {
  operation: "",
  clicked: 0
};

/*
 * Element constant
 */
const elements = {
  admin: document.querySelector(".admin__container"),
  backdrop: document.querySelector(".backdrop"),
  form: document.querySelector(".form__container")
};

const elementString = {
  usernameInput: ".username",
  passwordInput: ".password",
  repassInput: ".repassword"
};

/*
 * HTML constant
 */
const regExtraField = () => {
  const extraField = `
    <input
      type="password"
      class="input__field repassword"
      placeholder="re-enter password"
    />
  `;
  return extraField;
};

const formBuilder = (type = "login") => {
  let title = "LOGIN";
  if (type === "register") title = "REGISTER";

  const markup = `
    <div class="form__title-container">
      <img class="login__icon" src="static/img/contact.svg" alt="" />
      <h1 class="form__title">${title}</h1>
    </div>
    <form class="form__submit-container" id="submit-form">
      <input
        type="text"
        class="input__field username"
        placeholder="username"
        name="username"
      />
      <input
        type="password"
        class="input__field password"
        placeholder="password"
        name="password"
      />
      ${type === "register" ? regExtraField() : ""}
      <button type="button" class="btn btn__submit">${title}</button>
    </form>
  `;
  elements.form.insertAdjacentHTML("beforeend", markup);
};

/*
 * HTML controller
 */
const removeForm = () => {
  elements.form.innerHTML = "";
};

const addBackdrop = () => {
  elements.backdrop.style.display = "block";
  setTimeout(() => {
    elements.backdrop.classList.add("open");
  }, 10);
};

const removeBackdrop = () => {
  elements.backdrop.classList.remove("open");
  setTimeout(() => {
    elements.backdrop.style.display = "none";
  }, 350);
};

const clearInput = type => {
  document.querySelector(elementString.usernameInput).value = "";
  document.querySelector(elementString.passwordInput).value = "";
  if (type === "register")
    document.querySelector(elementString.repassInput).value = "";
};

const cleanUpForm = () => {
  removeBackdrop();
  removeForm();
};

// Handling the login/register button click
["hashchange", "load"].forEach(() => {
  const pathName = window.location.pathname;
  if (pathName === "/") {
    logoutPost();
    elements.admin.addEventListener("click", e => {
      if (state.clicked !== 1) {
        if (e.target.matches(".btn__login")) {
          addBackdrop();
          formBuilder("login");
          state.operation = "login";
          state.clicked = 1;
        } else if (e.target.matches(".btn__register")) {
          addBackdrop();
          formBuilder("register");
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
    cleanUpForm();
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
      loginPost(username, password);
    } else if (operation === "register") {
      if (checkPassword(password)) {
        registerPost(username, password);
      } else {
        console.log("failed");
        alert("PASSWORD DOES NOT MATCH");
        clearInput(state.operation);
      }
    }
  } else {
    alert("Please fill in the form!");
  }
};

/*
 * Send post request to /login endpoint
 */
const loginPost = (username = "", password = "") => {
  const cookie = document.cookie;
  if (cookie === "") {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    fetch("/login", {
      method: "POST",
      body: formData
    })
      .then(response => {
        const status = response.status;
        if (status >= 200 && status <= 300) {
          window.location.href = "/user";
        } else {
          alert("Login failed!");
          clearInput("login");
        }
        console.log(status);
        console.log(response);
      })
      .catch(error => {
        alert("Login failed! Please try again");
        console.log(error);
      });
  } else {
    window.location.href = "/user";
  }
};

/*
 * Send post request to /logout endpoint
 */
function logoutPost() {
  const cookie = document.cookie;
  if (cookie) {
    fetch("/logout", {
      method: "POST"
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }
}

/*
 * Send post request to /register endpoint
 */
const registerPost = (username = "", password = "") => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  fetch("/register", {
    method: "POST",
    body: formData
  })
    .then(response => {
      const status = response.status;
      if (status >= 200 && status <= 300) {
        alert("Registration success!");
        cleanUpForm();
        cleanState();
      } else {
        alert("Registration failed!");
        clearInput("register");
      }
      console.log(status);
      console.log(response);
    })
    .catch(error => {
      alert("Registeration failed! Please try again");
      console.log(error);
    });
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
