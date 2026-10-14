/* =====================================================
   LUXURY JEWELRY
   PAYMENT PAGE JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =================================================
       ELEMENTS
    ================================================= */

    const paymentForm = document.getElementById("paymentForm");
    const themeToggle = document.getElementById("themeToggle");
    const cardName = document.getElementById("cardName");
    const cardNameError = document.getElementById("cardNameError");
    const phoneNumber = document.getElementById("phoneNumber");
    const phoneNumberError = document.getElementById("phoneNumberError");
    const billingAddress = document.getElementById("billingAddress");
    const addressError = document.getElementById("addressError");
    const city = document.getElementById("city");
    const cityError = document.getElementById("cityError");
    const country = document.getElementById("country");
    const countryError = document.getElementById("countryError");
    const cardHolderName = document.getElementById("cardHolderName");
    const cardHolderNameError = document.getElementById("cardHolderNameError");
    const cardNumber = document.getElementById("cardNumber");
    const cardNumberError = document.getElementById("cardNumberError");
    const expiryDate = document.getElementById("expiryDate");
    const expiryError = document.getElementById("expiryError");
    const cvv = document.getElementById("cvv");
    const cvvError = document.getElementById("cvvError");
    const cardPayment = document.getElementById("cardPayment");
    const cashOnDelivery = document.getElementById("cashOnDelivery");
    const cardMethodOption = document.getElementById("cardMethodOption");
    const codMethodOption = document.getElementById("codMethodOption");
    const cardPaymentSection = document.getElementById("cardPaymentSection");
    const codInformation = document.getElementById("codInformation");
    const payButton = document.getElementById("payButton");
    const payButtonText = document.getElementById("payButtonText");
    const payButtonAmount = document.getElementById("payButtonAmount");
    const paymentProducts = document.getElementById("paymentProducts");
    const summaryItemCount = document.getElementById("summaryItemCount");
    const paymentSubtotal = document.getElementById("paymentSubtotal");
    const paymentShipping = document.getElementById("paymentShipping");
    const paymentTotal = document.getElementById("paymentTotal");
    const paymentModal = document.getElementById("paymentModal");
    const orderNumber = document.getElementById("orderNumber");
    const successMessage = document.getElementById("successMessage");
    const continueButton = document.getElementById("continueButton");
    const modalClose = document.getElementById("modalClose");

    /* =================================================
       LOGIN CHECK
    ================================================= */

    let loggedInUser;

    try {
        loggedInUser = JSON.parse(
            localStorage.getItem("luxuryJewelryLoggedInUser") || "null"
        );
    } catch (error) {
        loggedInUser = null;
    }

    if (!loggedInUser) {
        window.location.href = "login.html";
        return;
    }

    /* =================================================
       USER KEY
       Keep the same format as the profile page.
    ================================================= */

    function createUserKey(user) {
        if (!user) {
            return null;
        }

        const identifier = user.id || user.userId || user.email;

        if (!identifier) {
            return null;
        }

        return String(identifier)
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9_-]/g, "_");
    }

    function getUserKey() {
        return createUserKey(loggedInUser);
    }

    const userKey = getUserKey();

    if (!userKey) {
        window.location.href = "login.html";
        return;
    }

    /* =================================================
       USER CART
    ================================================= */

    const cartStorageKey = `luxuryJewelryCart_${userKey}`;

    function getUserCart() {
        try {
            const cart = JSON.parse(
                localStorage.getItem(cartStorageKey) || "[]"
            );

            return Array.isArray(cart) ? cart : [];
        } catch (error) {
            console.error("Could not read cart:", error);
            return [];
        }
    }

    let cart = getUserCart();

    /* =================================================
       FORMAT PRICE
    ================================================= */

    function formatPrice(price) {
        return `$${Number(price || 0).toFixed(2)}`;
    }

    /* =================================================
       ESCAPE HTML
    ================================================= */

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /* =================================================
       CALCULATE TOTALS
    ================================================= */

    function calculateTotals(cart) {
        let subtotal = 0;
        let totalItems = 0;

        cart.forEach(function (item) {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 1;

            subtotal += price * quantity;
            totalItems += quantity;
        });

        const shipping = 0;
        const total = subtotal + shipping;

        return {
            subtotal,
            shipping,
            total,
            totalItems
        };
    }

    /* =================================================
       RENDER PRODUCTS
    ================================================= */

    function renderProducts(cart) {
        if (!paymentProducts) {
            return;
        }

        if (!cart.length) {
            paymentProducts.innerHTML = `
                <div class="empty-payment-cart">
                    Your cart is empty.
                </div>
            `;
            return;
        }

        paymentProducts.innerHTML = cart.map(function (item) {
            const quantity = Number(item.quantity) || 1;
            const price = Number(item.price) || 0;
            const itemTotal = price * quantity;
            const image = item.image || "images/logo.jpeg";
            const name = item.name || "Jewelry Item";

            return `
                <div class="payment-product">
                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(name)}"
                        class="payment-product-image"
                    >

                    <div class="payment-product-info">
                        <h3>${escapeHTML(name)}</h3>
                        <p>Quantity: ${quantity}</p>
                    </div>

                    <div class="payment-product-price">
                        ${formatPrice(itemTotal)}
                    </div>
                </div>
            `;
        }).join("");
    }

    /* =================================================
       UPDATE SUMMARY
    ================================================= */

    function updateSummary(cart) {
        const totals = calculateTotals(cart);

        renderProducts(cart);

        if (summaryItemCount) {
            summaryItemCount.textContent =
                `${totals.totalItems} ${totals.totalItems === 1 ? "item" : "items"}`;
        }

        if (paymentSubtotal) {
            paymentSubtotal.textContent = formatPrice(totals.subtotal);
        }

        if (paymentShipping) {
            paymentShipping.textContent =
                totals.shipping === 0
                    ? "Free"
                    : formatPrice(totals.shipping);
        }

        if (paymentTotal) {
            paymentTotal.textContent = formatPrice(totals.total);
        }

        if (payButtonAmount) {
            payButtonAmount.textContent = formatPrice(totals.total);
        }

        if (payButton) {
            payButton.disabled = cart.length === 0;
        }
    }

    /* =================================================
       ERROR FUNCTIONS
    ================================================= */

    function showError(element, message) {
        if (element) {
            element.textContent = message;
        }
    }

    function clearError(element) {
        if (element) {
            element.textContent = "";
        }
    }

    function clearAllErrors() {
        clearError(cardNameError);
        clearError(phoneNumberError);
        clearError(addressError);
        clearError(cityError);
        clearError(countryError);
        clearError(cardHolderNameError);
        clearError(cardNumberError);
        clearError(expiryError);
        clearError(cvvError);
    }

    /* =================================================
       PAYMENT METHOD
    ================================================= */

    function getPaymentMethod() {
        return cashOnDelivery && cashOnDelivery.checked
            ? "cod"
            : "card";
    }

    function updatePaymentMethodUI() {
        const method = getPaymentMethod();

        if (method === "cod") {
            if (cardPaymentSection) {
                cardPaymentSection.style.display = "none";
            }

            if (codInformation) {
                codInformation.classList.add("show");
            }

            if (cardMethodOption) {
                cardMethodOption.classList.remove("selected");
            }

            if (codMethodOption) {
                codMethodOption.classList.add("selected");
            }

            if (payButtonText) {
                payButtonText.textContent = "Place Order";
            }
        } else {
            if (cardPaymentSection) {
                cardPaymentSection.style.display = "";
            }

            if (codInformation) {
                codInformation.classList.remove("show");
            }

            if (cardMethodOption) {
                cardMethodOption.classList.add("selected");
            }

            if (codMethodOption) {
                codMethodOption.classList.remove("selected");
            }

            if (payButtonText) {
                payButtonText.textContent = "Pay Now";
            }
        }
    }

    if (cardPayment) {
        cardPayment.addEventListener("change", updatePaymentMethodUI);
    }

    if (cashOnDelivery) {
        cashOnDelivery.addEventListener("change", updatePaymentMethodUI);
    }

    /* =================================================
       VALIDATE PAYMENT
    ================================================= */

    function validatePayment() {
        clearAllErrors();

        let isValid = true;

        const fullName = cardName.value.trim();

        if (!fullName) {
            showError(cardNameError, "Please enter your full name.");
            isValid = false;
        } else if (fullName.length < 2) {
            showError(cardNameError, "Please enter a valid name.");
            isValid = false;
        }

        const phone = phoneNumber.value.trim();

        if (!phone) {
            showError(phoneNumberError, "Please enter your phone number.");
            isValid = false;
        } else if (!/^[0-9+\-\s()]{7,20}$/.test(phone)) {
            showError(phoneNumberError, "Please enter a valid phone number.");
            isValid = false;
        }

        const address = billingAddress.value.trim();

        if (!address) {
            showError(addressError, "Please enter your delivery address.");
            isValid = false;
        } else if (address.length < 3) {
            showError(addressError, "Please enter a complete address.");
            isValid = false;
        }

        if (!city.value.trim()) {
            showError(cityError, "Please enter your city.");
            isValid = false;
        }

        if (!country.value.trim()) {
            showError(countryError, "Please enter your country.");
            isValid = false;
        }

        if (getPaymentMethod() === "card") {
            const holder = cardHolderName.value.trim();

            if (!holder) {
                showError(
                    cardHolderNameError,
                    "Please enter the cardholder name."
                );
                isValid = false;
            } else if (holder.length < 2) {
                showError(
                    cardHolderNameError,
                    "Please enter a valid cardholder name."
                );
                isValid = false;
            }

            const cardDigits = cardNumber.value.replace(/\D/g, "");

            if (!cardDigits) {
                showError(cardNumberError, "Please enter your card number.");
                isValid = false;
            } else if (
                cardDigits.length < 13 ||
                cardDigits.length > 19
            ) {
                showError(cardNumberError, "Please enter a valid card number.");
                isValid = false;
            }

            const expiry = expiryDate.value.trim();

            if (!expiry) {
                showError(expiryError, "Please enter the expiry date.");
                isValid = false;
            } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
                showError(expiryError, "Use MM/YY format.");
                isValid = false;
            }

            const cvvDigits = cvv.value.replace(/\D/g, "");

            if (!cvvDigits) {
                showError(cvvError, "Please enter your CVV.");
                isValid = false;
            } else if (
                cvvDigits.length < 3 ||
                cvvDigits.length > 4
            ) {
                showError(cvvError, "Please enter a valid CVV.");
                isValid = false;
            }
        }

        return isValid;
    }

    /* =================================================
       INPUT FORMATTING
    ================================================= */

    if (cardNumber) {
        cardNumber.addEventListener("input", function () {
            let value = this.value.replace(/\D/g, "").slice(0, 19);
            value = value.match(/.{1,4}/g)?.join(" ") || "";
            this.value = value;
        });
    }

    if (expiryDate) {
        expiryDate.addEventListener("input", function () {
            let value = this.value.replace(/\D/g, "").slice(0, 4);

            if (value.length >= 3) {
                value = value.slice(0, 2) + "/" + value.slice(2);
            }

            this.value = value;
        });
    }

    if (cvv) {
        cvv.addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, "").slice(0, 4);
        });
    }

    if (phoneNumber) {
        phoneNumber.addEventListener("input", function () {
            this.value = this.value
                .replace(/[^\d+\-\s()]/g, "")
                .slice(0, 20);
        });
    }

    /* =================================================
       CREATE ORDER NUMBER
    ================================================= */

    function createOrderNumber() {
        return "LJ" + Date.now() + "-" +
            Math.random().toString(36).slice(2, 7).toUpperCase();
    }

    /* =================================================
       SAVE ORDER
       Save the order under the current user's key.
    ================================================= */

    function saveOrder(cart, total, paymentMethod) {
        // Read the latest logged-in user.
        let currentUser;

        try {
            currentUser = JSON.parse(
                localStorage.getItem("luxuryJewelryLoggedInUser") || "null"
            );
        } catch (error) {
            throw new Error("Could not read your account.");
        }

        if (!currentUser) {
            throw new Error("Please log in before placing an order.");
        }

        const currentIdentifier =
            currentUser.id ||
            currentUser.userId ||
            currentUser.email;

        const currentUserKey = createUserKey(currentUser);

        if (!currentIdentifier || !currentUserKey) {
            throw new Error("Your account information is incomplete.");
        }

        // Prevent saving a cart under a different account.
        if (currentUserKey !== userKey) {
            throw new Error(
                "Your account changed. Please reload the payment page."
            );
        }

        const orderId = createOrderNumber();

        let cardLast4 = null;

        if (paymentMethod === "Card" && cardNumber) {
            cardLast4 = cardNumber.value
                .replace(/\D/g, "")
                .slice(-4);
        }

        const order = {
            orderId: orderId,
            userId: currentIdentifier,
            customerName: cardName.value.trim(),
            phoneNumber: phoneNumber.value.trim(),
            deliveryAddress: billingAddress.value.trim(),
            city: city.value.trim(),
            country: country.value.trim(),
            items: cart.map(function (item) {
                return { ...item };
            }),
            total: Number(total) || 0,
            status: paymentMethod === "Cash on Delivery"
                ? "Pending Payment"
                : "Paid",
            paymentMethod: paymentMethod,
            cardLast4: cardLast4,
            createdAt: new Date().toISOString()
        };

        const ordersKey = `luxuryJewelryOrders_${currentUserKey}`;

        let orders = [];

        try {
            const savedOrders = localStorage.getItem(ordersKey);

            orders = savedOrders
                ? JSON.parse(savedOrders)
                : [];

            if (!Array.isArray(orders)) {
                orders = [];
            }

            orders.push(order);

            localStorage.setItem(
                ordersKey,
                JSON.stringify(orders)
            );
            // Verify that the order was saved before clearing the cart.
            const verification = JSON.parse(
                localStorage.getItem(ordersKey) || "[]"
            );

            const orderWasSaved = Array.isArray(verification) &&
                verification.some(function (savedOrder) {
                    return savedOrder.orderId === orderId;
                });

            if (!orderWasSaved) {
                throw new Error("Order verification failed.");
            }

        } catch (error) {
            console.error("Order saving failed:", error);

            throw new Error(
                "Your order could not be saved. Please try again."
            );
        }

        return order;
    }

    /* =================================================
       SHOW SUCCESS MODAL
    ================================================= */

    function showSuccessModal(order) {
        if (orderNumber) {
            orderNumber.textContent = order.orderId;
        }

        if (successMessage) {
            successMessage.textContent =
                order.paymentMethod === "Cash on Delivery"
                    ? "Your order has been placed successfully. Please prepare the cash payment for delivery."
                    : "Your payment was successful and your order has been confirmed.";
        }

        if (paymentModal) {
            paymentModal.classList.add("show");
            paymentModal.setAttribute("aria-hidden", "false");
        }
    }

    /* =================================================
       COMPLETE PAYMENT / ORDER
    ================================================= */

    function completePayment() {
        if (!loggedInUser) {
            window.location.href = "login.html";
            return;
        }

        // Confirm that the current account has not changed.
        let currentUser;

        try {
            currentUser = JSON.parse(
                localStorage.getItem("luxuryJewelryLoggedInUser") || "null"
            );
        } catch (error) {
            currentUser = null;
        }

        if (!currentUser || createUserKey(currentUser) !== userKey) {
            alert("Your account changed. Please log in again.");
            window.location.href = "login.html";
            return;
        }

        cart = getUserCart();

        if (!cart.length) {
            alert("Your cart is empty.");
            window.location.href = "shop.html";
            return;
        }

        if (!validatePayment()) {
            return;
        }

        const totals = calculateTotals(cart);
        const method = getPaymentMethod();

        const paymentMethod = method === "cod"
            ? "Cash on Delivery"
            : "Card";

        if (payButton) {
            payButton.disabled = true;
        }

        if (payButtonText) {
            payButtonText.textContent = method === "cod"
                ? "Placing Order..."
                : "Processing Payment...";
        }

        setTimeout(function () {
            try {
                // Save the order before removing the cart.
                const order = saveOrder(
                    cart,
                    totals.total,
                    paymentMethod
                );

                localStorage.removeItem(cartStorageKey);

                cart = [];
                updateSummary(cart);
                showSuccessModal(order);

            } catch (error) {
                console.error("Checkout error:", error);
                alert(error.message || "Something went wrong.");

            } finally {
                if (payButton) {
                    payButton.disabled = false;
                }

                updatePaymentMethodUI();
            }
        }, 1200);
    }

    /* =================================================
       FORM SUBMIT
    ================================================= */

    if (paymentForm) {
        paymentForm.addEventListener("submit", function (event) {
            event.preventDefault();
            completePayment();
        });
    }

    /* =================================================
       CLOSE MODAL
    ================================================= */

    function closeModal() {
        if (paymentModal) {
            paymentModal.classList.remove("show");
            paymentModal.setAttribute("aria-hidden", "true");
        }
    }

    if (modalClose) {
        modalClose.addEventListener("click", closeModal);
    }

    const modalOverlay = document.querySelector(".modal-overlay");

    if (modalOverlay) {
        modalOverlay.addEventListener("click", closeModal);
    }

    /* =================================================
       CONTINUE SHOPPING
    ================================================= */

    if (continueButton) {
        continueButton.addEventListener("click", function () {
            window.location.href = "index.html";
        });
    }

    /* =================================================
       ESCAPE KEY
    ================================================= */

    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            paymentModal &&
            paymentModal.classList.contains("show")
        ) {
            closeModal();
        }
    });

    /* =================================================
       THEME
    ================================================= */

    function applyTheme() {
        const savedTheme = localStorage.getItem("luxuryJewelryTheme");

        if (savedTheme === "dark") {
            document.body.classList.add("dark-mode");

            if (themeToggle) {
                themeToggle.textContent = "☀";
            }
        } else {
            document.body.classList.remove("dark-mode");

            if (themeToggle) {
                themeToggle.textContent = "☾";
            }
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            const isDark = document.body.classList.toggle("dark-mode");

            localStorage.setItem(
                "luxuryJewelryTheme",
                isDark ? "dark" : "light"
            );

            themeToggle.textContent = isDark ? "☀" : "☾";
        });
    }

    /* =================================================
       INITIALIZE
    ================================================= */

    applyTheme();
    updatePaymentMethodUI();
    updateSummary(cart);

});