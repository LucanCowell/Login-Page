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

    loginForm.addEventListener("submit", async e => { 
        e.preventDefault(); 
        
        const usernameOrEmail = loginForm.querySelector("input[placeholder='Username or Email']").value;
        const password = loginForm.querySelector("input[placeholder='Password']").value;

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usernameOrEmail, password })
            });

            const data = await response.json();

            if (response.ok) {
                setFormMessage(loginForm, "success", "Welcome back! Redirecting...");
                

                localStorage.setItem("userToken", data.token); 
                localStorage.setItem("username", data.user.username); 


                setTimeout(() => {
                    window.location.href = "./dashboard.html"; 
                }, 1000);
            } else {
                setFormMessage(loginForm, "error", data.message || "Invalid credentials");
            }
        } catch (error) {
            setFormMessage(loginForm, "error", "Could not connect to the backend server.");
        }
    });

    createAccountForm.addEventListener("submit", async e => {
        e.preventDefault();

        const username = document.querySelector("#signupUsername").value;
        const email = createAccountForm.querySelector("input[placeholder='Email Address']").value;
        const password = document.querySelector("#signupPassword").value;
        const confirmPassword = document.querySelector("#signupConfirmPassword").value;

        if (password !== confirmPassword) {
            setInputError(document.querySelector("#signupConfirmPassword"), "Passwords do not match");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                setFormMessage(createAccountForm, "success", "Account created! Please log in.");
                
                setTimeout(() => {
                    createAccountForm.reset();
                    createAccountForm.classList.add("formHidden");
                    loginForm.classList.remove("formHidden");
                    setFormMessage(loginForm, "success", "Account ready! Log in below.");
                }, 2000);
            } else {
                setFormMessage(createAccountForm, "error", data.message || "Registration failed.");
            }
        } catch (error) {
            setFormMessage(createAccountForm, "error", "Could not connect to the backend server.");
        }
    });

    document.querySelectorAll(".formInput").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 10) {
                setInputError(inputElement, "Username must be at least 10 characters long");
            }

            if (e.target.id === "signupConfirmPassword") {
                const passwordElement = document.querySelector("#signupPassword");
                if (e.target.value.length > 0 && passwordElement.value !== e.target.value) {
                    setInputError(inputElement, "Passwords do not match");
                }
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});
