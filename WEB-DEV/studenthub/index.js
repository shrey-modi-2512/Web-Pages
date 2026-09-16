// index.js - homepage interactions

// scroll down to the news/content section when Explore Now is clicked
const exploreBtn = document.getElementById("exploreBtn");
const contentSection = document.getElementById("content");

exploreBtn.addEventListener("click", function () {
    contentSection.scrollIntoView({ behavior: "smooth" });
});

// highlight the current page in the nav bar
const navLinks = document.querySelectorAll("nav a");
const currentPage = window.location.pathname.split("/").pop() || "index.html";

navLinks.forEach(function (link) {
    if (link.getAttribute("href") === currentPage) {
        link.style.color = "#39c16c";
        link.style.fontWeight = "bold";
    }
});
