// admin.js - basic click actions for the admin panel (demo only, no backend)

const panelSections = document.querySelectorAll("main section");

panelSections.forEach(function (section) {
    section.addEventListener("click", function () {
        const title = section.querySelector("h3").textContent;
        alert("Opening: " + title);
    });
});

const quickActions = document.querySelectorAll("aside li");

quickActions.forEach(function (action) {
    action.addEventListener("click", function () {
        const confirmed = confirm(action.textContent + " - are you sure?");
        if (confirmed) {
            alert(action.textContent + " done.");
        }
    });
});
