
// ==========================================
// BHAVKADEVI TEMPLE - DONATION FORM
// ==========================================

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx3U5l1w7LkV7JkAhDhlYNKeuantxDnkazjmKUKCyCTW7lKv4mHjNxuF3miFjZ52sJX6w/exec";

const donationForm = document.getElementById("donationForm");
const formMessage = document.getElementById("formMessage");
const submitButton = document.getElementById("submitDonation");

let latestTemporaryReceipt = null;

// ==========================================
// DONATION FORM SUBMISSION
// ==========================================

donationForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = document.getElementById("contributorName").value.trim();
    const phone = document.getElementById("whatsappNumber").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const screenshot = document.getElementById("paymentScreenshot").files[0];

    if (name.length < 2 || name.length > 100) {
        showMessage("Please enter a valid name.", "error");
        return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
        showMessage("Please enter a valid 10-digit WhatsApp number.", "error");
        return;
    }

    if (!Number.isSafeInteger(amount) || amount <= 0) {
        showMessage("Please enter a valid donation amount.", "error");
        return;
    }

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

    if (SCRIPT_URL === "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE") {
        showMessage("Donation service is not connected yet.", "error");
        return;
    }

    try {

        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        showMessage(
            "Please wait. Submitting your donation...",
            "info"
        );

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

        // Submit to Apps Script
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
            throw new Error(
                result.message || "Donation submission failed."
            );
        }

        // ==========================================
        // CREATE TEMPORARY RECEIPT INFORMATION
        // ==========================================

        latestTemporaryReceipt = {
            name: name,
            phone: phone,
            amount: amount,
            referenceId: result.referenceId,
            date: new Date()
        };

        showMessage(
            "Donation submitted successfully! Reference ID: " +
            result.referenceId +
            ". Payment verification is pending.",
            "success"
        );

        // Display temporary receipt download option
        showTemporaryReceiptButton();

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

// ==========================================
// TEMPORARY RECEIPT DOWNLOAD BUTTON
// ==========================================

function showTemporaryReceiptButton() {

    let receiptButton = document.getElementById(
        "temporaryReceiptButton"
    );

    if (!receiptButton) {

        receiptButton = document.createElement("button");

        receiptButton.id = "temporaryReceiptButton";
        receiptButton.type = "button";
        receiptButton.className = "main-btn";

        receiptButton.style.marginTop = "15px";
        receiptButton.style.background = "#8b5e24";
        receiptButton.style.color = "#ffffff";
        receiptButton.style.display = "block";
        receiptButton.style.width = "100%";

        formMessage.insertAdjacentElement(
            "afterend",
            receiptButton
        );
    }

    receiptButton.textContent =
        "📄 Download Temporary Receipt";

    receiptButton.onclick = openTemporaryReceipt;
}

// ==========================================
// HTML SECURITY HELPER
// ==========================================

function escapeReceiptText(value) {

    return String(value).replace(/[&<>"']/g, function (character) {

        const replacements = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return replacements[character];
    });
}

// ==========================================
// GENERATE TEMPORARY RECEIPT
// ==========================================

function openTemporaryReceipt() {

    if (!latestTemporaryReceipt) {
        alert("Temporary receipt information is unavailable.");
        return;
    }

    const receipt = latestTemporaryReceipt;

    const receiptWindow = window.open(
        "",
        "_blank",
        "width=800,height=850"
    );

    if (!receiptWindow) {

        alert(
            "Please allow pop-ups for this website to open your temporary receipt."
        );

        return;
    }

    const formattedAmount = Number(
        receipt.amount
    ).toLocaleString("en-IN");

    const formattedDate = new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    ).format(receipt.date);

    const safeName = escapeReceiptText(receipt.name);
    const safePhone = escapeReceiptText(receipt.phone);
    const safeReference = escapeReceiptText(receipt.referenceId);
    const safeAmount = escapeReceiptText(formattedAmount);
    const safeDate = escapeReceiptText(formattedDate);

    const receiptHTML = `
<!DOCTYPE html>
<html lang="mr">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Temporary Donation Receipt</title>

<style>

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    padding: 25px;
    background: #f4f0e9;
    font-family: "Noto Sans Devanagari", Arial, sans-serif;
    color: #35251c;
}

.receipt {
    max-width: 700px;
    margin: 20px auto;
    padding: 35px;
    background: #fffdf8;
    border: 3px double #a77b38;
    outline: 1px solid #d9bd8a;
    outline-offset: -10px;
}

.header {
    text-align: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #d8bd91;
}

.temple {
    font-size: 25px;
    font-weight: bold;
    color: #843c20;
    margin-bottom: 8px;
}

.event {
    font-size: 19px;
    color: #a16c2b;
    font-weight: bold;
}

.committee {
    margin-top: 12px;
    font-size: 14px;
    font-weight: bold;
}

.receipt-title {
    text-align: center;
    margin: 25px 0 15px;
    font-size: 21px;
    color: #843c20;
    font-weight: bold;
}

.status {
    width: fit-content;
    margin: 0 auto 25px;
    padding: 9px 20px;
    border: 1px solid #c58c27;
    border-radius: 5px;
    background: #fff1cd;
    color: #8b5c0a;
    font-size: 13px;
    font-weight: bold;
    letter-spacing: 1px;
}

.details {
    width: 100%;
    border-collapse: collapse;
}

.details td {
    padding: 13px 8px;
    border-bottom: 1px solid #eadfce;
    font-size: 14px;
}

.details td:first-child {
    color: #765b43;
    width: 42%;
}

.details td:last-child {
    font-weight: bold;
    overflow-wrap: anywhere;
}

.amount {
    color: #843c20;
    font-size: 19px !important;
}

.notice {
    margin-top: 25px;
    padding: 15px;
    background: #fff5e3;
    border-left: 4px solid #b17a29;
    font-size: 13px;
    line-height: 1.8;
}

.footer {
    margin-top: 30px;
    text-align: center;
    font-size: 13px;
    line-height: 1.8;
    color: #765b43;
}

.print-button {
    display: block;
    margin: 20px auto;
    padding: 12px 25px;
    border: none;
    border-radius: 5px;
    background: #843c20;
    color: white;
    font-size: 15px;
    cursor: pointer;
}

@media print {

    body {
        padding: 0;
        background: white;
    }

    .receipt {
        margin: 0 auto;
        max-width: 100%;
        min-height: 90vh;
        break-inside: avoid;
    }

    .print-button {
        display: none;
    }

    @page {
        size: A4;
        margin: 15mm;
    }
}

</style>
</head>

<body>

<div class="receipt">

    <div class="header">

        <div class="temple">
            ॥ श्री भावकादेवी मंदिर ॥
        </div>

        <div class="event">
            ✦ सुवर्ण महोत्सव – २०२६ ✦
        </div>

        <div class="committee">
            श्री भावकादेवी उत्सव मंडळ - मुंबई
            (कातळकरी घराणे)
        </div>

    </div>

    <div class="receipt-title">
        तात्पुरती देणगी पोचपावती
    </div>

    <div class="status">
        PENDING VERIFICATION
    </div>

    <table class="details">

        <tr>
            <td>Reference ID</td>
            <td>${safeReference}</td>
        </tr>

        <tr>
            <td>योगदानकर्त्याचे नाव</td>
            <td>${safeName}</td>
        </tr>

        <tr>
            <td>व्हॉट्सॲप क्रमांक</td>
            <td>+91 ${safePhone}</td>
        </tr>

        <tr>
            <td>देणगीची रक्कम</td>
            <td class="amount">₹ ${safeAmount}</td>
        </tr>

        <tr>
            <td>सबमिशन दिनांक</td>
            <td>${safeDate}</td>
        </tr>

        <tr>
            <td>पेमेंट स्थिती</td>
            <td style="color:#a16c18;">
                पडताळणी प्रलंबित
            </td>
        </tr>

    </table>

    <div class="notice">

        <strong>महत्त्वाची सूचना:</strong><br>

        ही तात्पुरती देणगी पोचपावती आहे.
        आपले पेमेंट अद्याप मंडळाकडून तपासणीच्या प्रतीक्षेत आहे.
        पेमेंटची पडताळणी आणि मंजुरी झाल्यानंतर
        अंतिम देणगी पावती दिली जाईल.

        <br><br>

        ही पोचपावती पेमेंट यशस्वी झाल्याचा अंतिम पुरावा नाही.

    </div>

    <div class="footer">

        आपल्या अनमोल योगदानाबद्दल खूप खूप आभार!<br>
        आपले सहकार्य हीच आई माऊलीची सेवा..!!

        <br><br>

        <strong>
            भावकादेवी उत्सव मंडळ - मुंबई
            (कातळकरी घराणे)
        </strong>

    </div>

</div>

<button class="print-button" onclick="window.print()">
    Print / Save as PDF
</button>

</body>
</html>
`;

    receiptWindow.document.open();
    receiptWindow.document.write(receiptHTML);
    receiptWindow.document.close();
}

// ==========================================
// UPI PAYMENT BUTTON
// ==========================================

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

        const upiLink =
            "upi://pay?pa=spwarik@oksbi" +
            "&pn=Shamrao%20Payaji%20Warik" +
            "&am=" + amount.toFixed(2) +
            "&cu=INR";

        window.location.href = upiLink;

    });

});
