
let currentLanguage = "en";

function toggleLanguage() {

    currentLanguage = currentLanguage === "en" ? "mr" : "en";

    // Translate all website text
    document.querySelectorAll("[data-en]").forEach(element => {

        const translation = element.getAttribute(
            currentLanguage === "en" ? "data-en" : "data-mr"
        );

        if (translation !== null) {
            element.textContent = translation;
        }

    });

    // Translate input placeholders
    document.querySelectorAll("[data-placeholder-en]").forEach(element => {

        element.placeholder = currentLanguage === "en"
            ? element.getAttribute("data-placeholder-en")
            : element.getAttribute("data-placeholder-mr");

    });

    // Update language button
    document.getElementById("languageBtn").textContent =
        currentLanguage === "en" ? "मराठी" : "English";

    // Update HTML language
    document.documentElement.lang = currentLanguage;

}


// ==========================================
// BHAVKADEVI - WEBSITE PROBLEM REPORTING
// ==========================================

const REPORT_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbx3U5l1w7LkV7JkAhDhlYNKeuantxDnkazjmKUKCyCTW7lKv4mHjNxuF3miFjZ52sJX6w/exec";

const problemReportForm =
    document.getElementById("problemReportForm");

if (problemReportForm) {

    problemReportForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const name = problemReportForm.elements["name"].value.trim();
        const phone = problemReportForm.elements["phone"].value.trim();
        const description =
            problemReportForm.elements["description"].value.trim();

        const messageElement =
            document.getElementById("problemReportMessage");

        const submitButton =
            problemReportForm.querySelector('button[type="submit"]');

        const isMarathi = currentLanguage === "mr";

        function reportMessage(english, marathi, color) {
            messageElement.textContent =
                isMarathi ? marathi : english;

            messageElement.style.color = color;
        }

        if (name.length < 2 || name.length > 80) {
            reportMessage(
                "Please enter a valid name.",
                "कृपया योग्य नाव टाका.",
                "red"
            );
            return;
        }

        if (!/^[6-9]\d{9}$/.test(phone)) {
            reportMessage(
                "Please enter a valid 10-digit mobile number.",
                "कृपया योग्य १० अंकी मोबाईल क्रमांक टाका.",
                "red"
            );
            return;
        }

        if (description.length < 10 || description.length > 2000) {
            reportMessage(
                "Description must contain 10 to 2000 characters.",
                "वर्णन १० ते २००० अक्षरांच्या दरम्यान असावे.",
                "red"
            );
            return;
        }

        if (problemReportForm.elements["website"].value.trim() !== "") {
            return;
        }

        try {

            submitButton.disabled = true;

            submitButton.textContent = isMarathi
                ? "पाठवत आहे..."
                : "Submitting...";

            reportMessage(
                "Please wait. Sending your report...",
                "कृपया थांबा. आपली तक्रार पाठवली जात आहे...",
                "#9b6b16"
            );

            const reportData = {
                type: "problemReport",
                name: name,
                phone: phone,
                description: description,
                language: currentLanguage,
                website: ""
            };

            const response = await fetch(REPORT_SCRIPT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(reportData),
                redirect: "follow"
            });

            if (!response.ok) {
                throw new Error("Server connection failed.");
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || "Report submission failed.");
            }

            reportMessage(
                "Your problem report has been sent successfully. Thank you!",
                "आपली तक्रार यशस्वीरित्या पाठवली आहे. धन्यवाद!",
                "green"
            );

            problemReportForm.reset();

        } catch (error) {

            console.error("Problem Report Error:", error);

            reportMessage(
                "Unable to send your report. Please try again later.",
                "तक्रार पाठवता आली नाही. कृपया पुन्हा प्रयत्न करा.",
                "red"
            );

        } finally {

            submitButton.disabled = false;

            submitButton.textContent = isMarathi
                ? "तक्रार पाठवा"
                : "Submit Report";

        }

    });

}


// ==========================================
// WEBSITE SCROLL REVEAL ANIMATION
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const revealElements = document.querySelectorAll(
        ".section h2, .about p, .about h3, .event-card, .purpose-card, .donate-box, .contact-box, .developer-info, .problem-report-box"
    );

    revealElements.forEach(element => {
        element.classList.add("reveal");
    });

    const observer = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {


// ==========================================
// SCROLL REVEAL + STAGGERED CARD ANIMATION
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const revealElements = document.querySelectorAll(
        ".section h2, .about p, .about h3, .event-card, .purpose-card, .donate-box, .contact-box, .developer-info, .problem-report-box"
    );

    // Add reveal class and stagger delay
    revealElements.forEach((element, index) => {

        element.classList.add("reveal");

        if (
            element.classList.contains("event-card") ||
            element.classList.contains("purpose-card") ||
            element.classList.contains("contact-box")
        ) {
            const cards = Array.from(element.parentElement.children);
            const cardIndex = cards.indexOf(element);

            element.style.transitionDelay = (cardIndex * 0.18) + "s";
        }

    });

    // Observe elements when they enter the screen
    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.10,
        rootMargin: "0px 0px -30px 0px"
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });

});
