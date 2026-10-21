// dashboard.js - little bit of interactivity for the student dashboard

// read the attendance number from the page and animate the bar to match
const attendanceText = document.getElementById("attendanceValue").textContent;
const attendancePercent = parseInt(attendanceText); // strips the % sign

window.addEventListener("load", function () {
    // small delay so the animation is actually visible
    setTimeout(function () {
        document.getElementById("attendanceBar").style.width = attendancePercent + "%";
    }, 200);
});

// clicking a quick link just shows an alert for now (no other pages wired up yet)
const quickLinks = document.querySelectorAll("aside li");
quickLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        alert(link.textContent + " page is coming soon!");
    });
});
