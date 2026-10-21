// register.js - form validation using regular expressions,
// real-time checks, password strength meter and CSRF token.
"use strict";

/* ---------- Regular expressions ---------- */
const PATTERNS = {
    fullname:   /^[A-Za-z]+(?:[ .'-][A-Za-z]+)*$/,                       // letters, spaces, . ' -
    email:      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/,
    phone:      /^[6-9][0-9]{9}$/,                                        // Indian mobile
    enrollment: /^[0-9]{10,12}$/,
    password:   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/
};

/* ---------- Element references ---------- */
const form = document.getElementById("regForm");
const summary = document.getElementById("errorSummary");
const successMsg = document.getElementById("successMsg");
const passwordField = document.getElementById("password");
const confirmField = document.getElementById("confirm");

/* ---------- Error helpers ---------- */
function showError(id, message) {
    const field = document.getElementById(id);
    const err = document.getElementById(id + "-error");
    err.textContent = message;
    err.style.display = "block";
    if (field) {
        field.classList.add("invalid");
        field.classList.remove("valid");
        field.setAttribute("aria-invalid", "true");
    }
    return false;
}

function clearError(id) {
    const field = document.getElementById(id);
    const err = document.getElementById(id + "-error");
    err.textContent = "";
    err.style.display = "none";
    if (field) {
        field.classList.remove("invalid");
        field.classList.add("valid");
        field.removeAttribute("aria-invalid");
    }
    return true;
}

/* ---------- Individual validators (return true / false) ---------- */
const validators = {
    fullname() {
        const v = document.getElementById("fullname").value.trim();
        if (v === "") return showError("fullname", "Enter your full name.");
        if (v.length < 2 || v.length > 50) return showError("fullname", "Name must be 2 to 50 characters long.");
        if (!PATTERNS.fullname.test(v)) return showError("fullname", "Use letters and spaces only, no numbers or symbols.");
        return clearError("fullname");
    },
    email() {
        const v = document.getElementById("email").value.trim();
        if (v === "") return showError("email", "Enter your email address.");
        if (!PATTERNS.email.test(v)) return showError("email", "Enter a valid email, for example name@college.edu.");
        return clearError("email");
    },
    phone() {
        const v = document.getElementById("phone").value.trim();
        if (v === "") return showError("phone", "Enter your mobile number.");
        if (!/^[0-9]+$/.test(v)) return showError("phone", "Use digits only.");
        if (!PATTERNS.phone.test(v)) return showError("phone", "Enter 10 digits starting with 6, 7, 8 or 9.");
        return clearError("phone");
    },
    enrollment() {
        const v = document.getElementById("enrollment").value.trim();
        if (v === "") return showError("enrollment", "Enter your enrollment number.");
        if (!PATTERNS.enrollment.test(v)) return showError("enrollment", "Enrollment number must be 10 to 12 digits.");
        return clearError("enrollment");
    },
    department() {
        return document.getElementById("department").value === ""
            ? showError("department", "Select your course.") : clearError("department");
    },
    year() {
        return document.getElementById("year").value === ""
            ? showError("year", "Select your year.") : clearError("year");
    },
    semester() {
        return document.getElementById("semester").value === ""
            ? showError("semester", "Select your semester.") : clearError("semester");
    },
    gender() {
        const chosen = form.querySelector('input[name="gender"]:checked');
        if (!chosen) {
            document.getElementById("gender-error").textContent = "Select a gender option.";
            document.getElementById("gender-error").style.display = "block";
            return false;
        }
        document.getElementById("gender-error").textContent = "";
        document.getElementById("gender-error").style.display = "none";
        return true;
    },
    password() {
        const v = passwordField.value;
        if (v === "") return showError("password", "Create a password.");
        if (!PATTERNS.password.test(v)) {
            const missing = [];
            if (v.length < 8) missing.push("8+ characters");
            if (!/[a-z]/.test(v)) missing.push("a lowercase letter");
            if (!/[A-Z]/.test(v)) missing.push("an uppercase letter");
            if (!/\d/.test(v)) missing.push("a number");
            if (!/[^A-Za-z0-9\s]/.test(v)) missing.push("a special character");
            return showError("password", "Password needs " + missing.join(", ") + ".");
        }
        return clearError("password");
    },
    confirm() {
        if (confirmField.value === "") return showError("confirm", "Re-enter your password.");
        if (confirmField.value !== passwordField.value) return showError("confirm", "Passwords do not match.");
        return clearError("confirm");
    },
    terms() {
        const t = document.getElementById("terms");
        if (!t.checked) return showError("terms", "You must accept the Terms and Conditions.");
        return clearError("terms");
    }
};


/* ---------- Password strength meter ---------- */
const bar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

function checkStrength(pw) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9\s]/.test(pw)) score++;
    return score; // 0 - 5
}

function updateStrength() {
    const pw = passwordField.value;
    if (pw === "") {
        bar.style.width = "0";
        strengthText.textContent = "";
        return;
    }
    const score = checkStrength(pw);
    const levels = [
        { label: "Very weak", color: "#d33" },
        { label: "Weak", color: "#e8590c" },
        { label: "Fair", color: "#f0a500" },
        { label: "Good", color: "#7cb518" },
        { label: "Strong", color: "#20b15a" },
        { label: "Very strong", color: "#16954a" }
    ];
    const lvl = levels[score];
    bar.style.width = ((score + 1) / 6 * 100) + "%";
    bar.style.background = lvl.color;
    strengthText.textContent = "Password strength: " + lvl.label;
    strengthText.style.color = lvl.color;
}

/* ---------- Real-time validation (input / keyup / blur / change) ---------- */
["fullname", "email", "phone", "enrollment"].forEach(function (id) {
    const el = document.getElementById(id);
    el.addEventListener("blur", validators[id]);
    el.addEventListener("keyup", function () { if (el.classList.contains("invalid") || el.classList.contains("valid")) validators[id](); });
});

// Live digit filtering for number fields
["phone", "enrollment"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", function (e) {
        e.target.value = e.target.value.replace(/\D/g, "");
    });
});

["department", "year", "semester"].forEach(function (id) {
    document.getElementById(id).addEventListener("change", validators[id]);
});

form.querySelectorAll('input[name="gender"]').forEach(function (r) {
    r.addEventListener("change", validators.gender);
});

document.getElementById("terms").addEventListener("change", validators.terms);

passwordField.addEventListener("keyup", function () {
    updateStrength();
    validators.password();
    if (confirmField.value !== "") validators.confirm();
});
passwordField.addEventListener("blur", validators.password);

confirmField.addEventListener("keyup", validators.confirm);
confirmField.addEventListener("blur", validators.confirm);

// Show / hide passwords
document.getElementById("showPass").addEventListener("change", function (e) {
    const type = e.target.checked ? "text" : "password";
    passwordField.type = type;
    confirmField.type = type;
});

/* ---------- Submit ---------- */
const labels = {
    fullname: "Full Name", email: "Email", phone: "Mobile Number", enrollment: "Enrollment Number",
    department: "Course", year: "Year", semester: "Semester", gender: "Gender",
    password: "Password", confirm: "Confirm Password", terms: "Terms and Conditions"
};
const focusTargets = {
    gender: "male"
};

form.addEventListener("submit", function (e) {
    successMsg.hidden = true;

    const failed = [];
    Object.keys(validators).forEach(function (name) {
        if (!validators[name]()) failed.push(name);
    });

    if (failed.length > 0) {
        summary.hidden = false;
        summary.innerHTML = "<strong>Please fix " + failed.length + " problem" + (failed.length > 1 ? "s" : "") + " below:</strong><ul>" +
            failed.map(function (n) {
                return '<li><a href="#' + (focusTargets[n] || n) + '">' + labels[n] + "</a></li>";
            }).join("") + "</ul>";
        summary.focus();
        e.preventDefault();   // stop submit; fix errors first
        return;
    }

    summary.hidden = true;
    // all valid: browser now POSTs the form to register.php
});

// Reset button should also clear messages
form.addEventListener("reset", function () {
    summary.hidden = true;
    successMsg.hidden = true;
    form.querySelectorAll(".field-error").forEach(function (el) { el.textContent = ""; el.style.display = "none"; });
    form.querySelectorAll(".valid, .invalid").forEach(function (el) { el.classList.remove("valid", "invalid"); el.removeAttribute("aria-invalid"); });
    setTimeout(function () { updateStrength(); }, 0);
});

/* ---------- CSRF token (Practical 7 advanced) ---------- */
fetch("csrf_token.php", { credentials: "same-origin" })
    .then(function (r) { return r.json(); })
    .then(function (d) { document.getElementById("csrfToken").value = d.token; })
    .catch(function () { console.warn("Could not get CSRF token. Run this page through PHP (XAMPP)."); });
