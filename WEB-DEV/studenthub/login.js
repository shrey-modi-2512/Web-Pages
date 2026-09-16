// login.js - show/hide password and a quick check before submit

const toggleBtn = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

toggleBtn.addEventListener("click", function () {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleBtn.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        toggleBtn.textContent = "Show";
    }
});

const loginForm = document.querySelector("form");

loginForm.addEventListener("submit", function (e) {
    const email = document.getElementById("email").value.trim();

    if (email === "" || passwordInput.value === "") {
        e.preventDefault();
        alert("Please fill in both email and password.");
        return;
    }

    // this project doesn't have a real backend yet, just a friendly message
    e.preventDefault();
    alert("Login form submitted (demo only, no server connected).");
});
