
// ==========================================
// BHAVKADEVI TEMPLE - DONATION FORM
// ==========================================

// We will add your deployed Apps Script URL here.
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx3U5l1w7LkV7JkAhDhlYNKeuantxDnkazjmKUKCyCTW7lKv4mHjNxuF3miFjZ52sJX6w/exec";

const donationForm = document.getElementById("donationForm");
const formMessage = document.getElementById("formMessage");
const submitButton = document.getElementById("submitDonation");

donationForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = document.getElementById("contributorName").value.trim();
    const phone = document.getElementById("whatsappNumber").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const screenshot = document.getElementById("paymentScreenshot").files[0];

    // Validate name
    if (name.length < 2 || name.length > 100) {
        showMessage("Please enter a valid name.", "error");
        return;
    }

    // Validate WhatsApp number
    if (!/^[6-9]\d{9}$/.test(phone)) {
        showMessage("Please enter a valid 10-digit WhatsApp number.", "error");
        return;
    }

    // Validate amount
    if (!Number.isSafeInteger(amount) || amount <= 0) {
        showMessage("Please enter a valid donation amount.", "error");
        return;
    }

    // Validate screenshot
    if (!screenshot) {
        showMessage("Please upload your payment screenshot.", "error");
        return;
    }

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (!allowedTypes.includes(screenshot.type)) {
        showMessage("Only JPG, PNG and WEBP images are allowed.", "error");
        return;
    }

    if (screenshot.size === 0 || screenshot.size > 4 * 1024 * 1024) {
        showMessage("Please select an image smaller than 4 MB.", "error");
        return;
    }

    // Check whether backend URL is configured
    if (SCRIPT_URL === "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE") {
        showMessage("Donation service is not connected yet.", "error");
        return;
    }

    try {

        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";
        showMessage("Please wait. Submitting your donation...", "info");

        // Convert screenshot into Base64
        const arrayBuffer = await screenshot.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        let binary = "";

        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }

        const base64 = btoa(binary);

        // Prepare donation information
        const donationData = {
            name: name,
            phone: phone,
            amount: amount,
            mimeType: screenshot.type,
            fileName: screenshot.name,
            base64: base64,
            website: ""
        };

        // Send information to Apps Script
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(donationData),
            redirect: "follow"
        });

        if (!response.ok) {
            throw new Error("Server connection failed.");
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Donation submission failed.");
        }

        showMessage(
            "Donation submitted successfully! Reference ID: " +
            result.referenceId +
            ". Payment verification is pending.",
            "success"
        );

        donationForm.reset();

    } catch (error) {

        console.error("Donation Error:", error);

        showMessage(
            "Unable to confirm submission. Please try again or contact the organisers. " +
            error.message,
            "error"
        );

    } finally {

        submitButton.disabled = false;

        submitButton.textContent =
            document.documentElement.lang === "mr"
                ? "देणगी सबमिट करा"
                : "Submit Donation";
    }

});

// ==========================================
// DISPLAY FORM MESSAGES
// ==========================================

function showMessage(message, type) {

    formMessage.textContent = message;

    if (type === "success") {
        formMessage.style.color = "green";
    } else if (type === "error") {
        formMessage.style.color = "red";
    } else {
        formMessage.style.color = "#9b6b16";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const payButton = document.getElementById("upiPayButton");
    const amountInput = document.getElementById("amount");

    if (!payButton || !amountInput) return;

    payButton.addEventListener("click", function (event) {
        event.preventDefault();

        const amount = Number(amountInput.value);

        if (!Number.isFinite(amount) || amount < 1) {
            alert("Please enter a valid donation amount.");
            amountInput.focus();
            return;
        }

        const params = new URLSearchParams({
    pa: "spwarik@oksbi",
    pn: "Shamrao Payaji Warik",
    am: Number(amount).toFixed(2),
    cu: "INR",
    tn: "Bhavkadevi Temple Suvarna Mahotsav",
    mc: "",
    tr: ""
});

window.location.href = "upi://pay?" + params.toString();
    });
});
