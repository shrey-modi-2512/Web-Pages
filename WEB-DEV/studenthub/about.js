// about.js - small script to fade in each section as the user scrolls down

// grab all the sections inside main and give them the fade-in class
const aboutSections = document.querySelectorAll("main section");

aboutSections.forEach(function (section) {
    section.classList.add("fade-in");
});

// simple check that runs on scroll and on page load
function revealSections() {
    const triggerPoint = window.innerHeight - 80;

    aboutSections.forEach(function (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top < triggerPoint) {
            section.classList.add("show");
        }
    });
}

window.addEventListener("scroll", revealSections);
window.addEventListener("load", revealSections);
