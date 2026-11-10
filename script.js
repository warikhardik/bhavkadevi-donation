
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
