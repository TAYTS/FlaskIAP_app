import { elements, elementString } from "./base";

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

export const formBuilder = (type = "login") => {
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

const removeForm = () => {
  elements.form.innerHTML = "";
};

export const addBackdrop = () => {
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

export const clearInput = type => {
  document.querySelector(elementString.usernameInput).value = "";
  document.querySelector(elementString.passwordInput).value = "";
  if (type === "register")
    document.querySelector(elementString.repassInput).value = "";
};

export const cleanUpForm = () => {
  removeBackdrop();
  removeForm();
};
