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
            am: amount.toFixed(2),
            cu: "INR",
            tn: "Bhavkadevi Temple Donation"
        });

        window.location.href = "upi://pay?" + params.toString();
    });
});
