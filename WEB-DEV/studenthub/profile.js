// profile.js - lets the student edit their name and animates the completion bar

const nameSpan = document.getElementById("profileName");
const editBtn = document.getElementById("editBtn");

editBtn.addEventListener("click", function () {
    const newName = prompt("Enter your name:", nameSpan.textContent);

    // only update if the user actually typed something
    if (newName !== null && newName.trim() !== "") {
        nameSpan.textContent = newName.trim();
    }
});

// pull the completion percentage out of the text and animate the bar
const completionText = document.getElementById("completionValue").textContent;
const completionPercent = parseInt(completionText.replace(/\D/g, ""));

window.addEventListener("load", function () {
    setTimeout(function () {
        document.getElementById("completionBar").style.width = completionPercent + "%";
    }, 200);
});
