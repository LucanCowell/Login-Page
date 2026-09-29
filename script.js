function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".formMessage");
    messageElement.textContent = message;
    messageElement.classList.remove("formMessageSuccess", "formMessageError");
    messageElement.classList.add(`formMessage${type}`);
}

setFormMessage(loginForm, "success", "You're logged in!");

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("formHidden");
        createAccountForm.classList.remove("formHidden");
    });
    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("formHidden");
        createAccountForm.classList.add("formHidden");
    });
});