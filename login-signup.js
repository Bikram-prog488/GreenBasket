document.addEventListener("DOMContentLoaded", function () {
    let formTitle = document.getElementById("form-title");
    let authForm = document.getElementById("auth-form");
    let authBtn = document.querySelector(".auth-btn");
    let toggleText = document.querySelector(".toggle-text");
    let nameField = document.querySelector(".name-group");
    let extraOptions = document.querySelector(".extra-options");

    document.getElementById("toggle-form").addEventListener("click", function (event) {
        event.preventDefault();
    
        let formTitle = document.getElementById("form-title");
        let authBtn = document.querySelector(".auth-btn");
        let nameField = document.querySelector(".name-group");
        let nameInput = document.getElementById("name");
    
        if (formTitle.innerText === "Login") {
            formTitle.innerText = "Sign Up";
            authBtn.innerText = "Sign Up";
            nameField.style.display = "flex";
            nameInput.setAttribute("required", "true"); // Enable required for signup
        } else {
            formTitle.innerText = "Login";
            authBtn.innerText = "Login";
            nameField.style.display = "none";
            nameInput.removeAttribute("required"); // Remove required for login
        }
    });
    

    authForm.addEventListener("submit", function (event) {
        event.preventDefault();
        let name = document.getElementById("name")?.value || "";
        let email = document.getElementById("email").value.trim(); // Trim spaces
        let password = document.getElementById("password").value.trim(); // Trim spaces
    
        let users = JSON.parse(localStorage.getItem("users")) || [];
        console.log("Existing Users:", users); // Debugging log
    
        if (formTitle.innerText === "Sign Up") {
            let existingUser = users.find(user => user.email === email);
            if (existingUser) {
                alert("User already exists. Please login.");
            } else {
                users.push({ name, email, password });
                localStorage.setItem("users", JSON.stringify(users));
                alert("Signup successful! Please login.");
    
                // Switch to login mode
                formTitle.innerText = "Login";
                authBtn.innerText = "Login";
                toggleText.innerHTML = `Don't have an account? <a href="#" id="toggle-form">Sign Up</a>`;
                nameField.style.display = "none";
                extraOptions.style.display = "flex";
            }
        } else {
            let user = users.find(user => user.email === email && user.password === password);
            console.log("Login Attempt:", { email, password, user });
    
            if (user) {
                localStorage.setItem("loggedInUser", user.name);
                alert("Login successful!");
                window.location.href = "index.html"; // Redirect to home
            } else {
                alert("Invalid credentials! Please check your email and password.");
            }
        }
    });
    
});
