// register.js - basic client side check before the form is submitted

const regForm = document.querySelector("form");
const passwordField = document.getElementById("password");
const confirmField = document.getElementById("confirm");

// make a small red message under confirm password to show errors
const errorMsg = document.createElement("div");
errorMsg.className = "field-error";
errorMsg.textContent = "Passwords do not match";
confirmField.insertAdjacentElement("afterend", errorMsg);

regForm.addEventListener("submit", function (e) {
    // reset error each time
    errorMsg.style.display = "none";

    if (passwordField.value.length < 6) {
        e.preventDefault();
        alert("Password should be at least 6 characters long.");
        passwordField.focus();
        return;
    }

    if (passwordField.value !== confirmField.value) {
        e.preventDefault();
        errorMsg.style.display = "block";
        confirmField.focus();
        return;
    }

    // if everything is fine, just let the user know (no backend yet)
    alert("Registration form looks good! (No server connected yet)");
});

// live check while typing the confirm password
confirmField.addEventListener("keyup", function () {
    if (confirmField.value === "") {
        errorMsg.style.display = "none";
    } else if (confirmField.value !== passwordField.value) {
        errorMsg.style.display = "block";
    } else {
        errorMsg.style.display = "none";
    }
});
