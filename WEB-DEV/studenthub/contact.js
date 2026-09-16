// contact.js - checks the contact form before "sending" it

const contactForm = document.getElementById("contactForm");
const statusMsg = document.getElementById("formStatus");

contactForm.addEventListener("submit", function (e) {
    e.preventDefault(); // no backend yet, so stop the page from reloading

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    if (name === "" || email === "" || message === "") {
        showStatus("Please fill in all the fields.", "error");
        return;
    }

    // very basic email check, not perfect but good enough here
    if (!email.includes("@") || !email.includes(".")) {
        showStatus("Please enter a valid email address.", "error");
        return;
    }

    showStatus("Thanks " + name + "! Your message has been noted.", "success");
    contactForm.reset();
});

function showStatus(text, type) {
    statusMsg.textContent = text;
    statusMsg.className = type;
    statusMsg.style.display = "block";
}
