function setFormMessage(formElement, type, message) { 
    const messageElement = formElement.querySelector(".formMessage"); 
    
    messageElement.textContent = message; 
    messageElement.classList.remove("formMessageSuccess", "formMessageError"); 
    messageElement.classList.add(`formMessage${type}`); 
}; 

function setInputError(inputElement, message) {
    const errorElement = inputElement.parentElement.querySelector(".formInputErrorMessage");
     
    inputElement.classList.add("formInputError"); 
    errorElement.textContent = message;
}

function clearInputError(inputElement) {
    const errorElement = inputElement.parentElement.querySelector(".formInputErrorMessage");
    
    inputElement.classList.remove("formInputError");
    errorElement.textContent = "";
}

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

    loginForm.addEventListener("submit", e => { 
        e.preventDefault(); 
        // AJAX / Fetch login 
        setFormMessage(loginForm, "error", "Invalid username/password combination"); 
    });

    createAccountForm.addEventListener("submit", e => {
        e.preventDefault();
        setFormMessage(createAccountForm, "success", "Account created successfully!");
    });

    document.querySelectorAll(".formInput").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 10) {
                setInputError(inputElement, "Username must be at least 10 characters long");
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});
