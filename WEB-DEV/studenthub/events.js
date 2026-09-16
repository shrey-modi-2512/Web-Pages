// events.js - handles the register button on each event card

const registerButtons = document.querySelectorAll(".register-btn");

registerButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        const eventName = btn.parentElement.querySelector("h3").textContent;

        btn.textContent = "Registered";
        btn.disabled = true;

        alert("You have registered for " + eventName + "!");
    });
});
