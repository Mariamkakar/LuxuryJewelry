/* =========================================
   LUXURY JEWELRY - CART
   USER-SPECIFIC CART SYSTEM
========================================= */


/* ================================================================================
   USER
   Retrieves the logged-in user's data from localStorage and handles invalid JSON.
=======================================================================*/

function getCartLoggedInUser() {

    const userData =
        localStorage.getItem(
            "luxuryJewelryLoggedInUser"
        );

    if (!userData) {
        return null;
    }

    try {

        return JSON.parse(userData);

    } catch (error) {

        console.error(
            "Invalid logged-in user data."
        );

        return null;

    }

}


/* =======================================================================
   USER KEY
   Creates a unique key for the current user using their ID or email.
==========================================================*/

function getCartUserKey() {

    const user =
        getCartLoggedInUser();

    if (!user) {
        return null;
    }

    const uniqueId =
        user.id ||
        user.userId ||
        user.email;

    if (!uniqueId) {
        return null;
    }

    return String(uniqueId)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");

}


/* =========================================================================
   USER CART STORAGE KEY
   Generates a separate localStorage key for each user's shopping cart.
=============================================================== */

function getCartStorageKey() {

    const userKey =
        getCartUserKey();

    if (!userKey) {
        return null;
    }

    return `luxuryJewelryCart_${userKey}`;

}


/* ======================================================================================
   GET USER CART
   Loads the user's cart from localStorage and returns an empty array if unavailable.
========================================================================= */

function getUserCart() {

    const storageKey =
        getCartStorageKey();

    if (!storageKey) {
        return [];
    }

    const savedCart =
        localStorage.getItem(
            storageKey
        );

    if (!savedCart) {
        return [];
    }

    try {

        const cart =
            JSON.parse(
                savedCart
            );

        return Array.isArray(cart)
            ? cart
            : [];

    } catch (error) {

        console.error(
            "Invalid cart data."
        );

        return [];

    }

}


/* =====================================================================================
   SAVE USER CART
   Saves the cart, refreshes the page, and notifies other components about changes.
=====================================================================*/

function saveUserCart(cart) {

    const storageKey =
        getCartStorageKey();

    if (!storageKey) {
        return;
    }

    localStorage.setItem(
        storageKey,
        JSON.stringify(cart)
    );


    updateCartPage();


    window.dispatchEvent(
        new CustomEvent(
            "cartUpdated"
        )
    );

}


/* ======================================================
   FORMAT PRICE
   Formats a price as dollars with two decimal places.
========================================= */

function formatPrice(price) {

    const number =
        Number(price) || 0;

    return `$${number.toFixed(2)}`;

}


/* =================================================================
   ESCAPE HTML
   Escapes special HTML characters to help prevent HTML injection.
=================================================== */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =============================================================================
   RENDER CART
   Displays the cart products, quantities, prices, and empty-cart messages.
============================================================== */

function renderCart() {

    const cartItemsContainer =
        document.getElementById(
            "cartItems"
        );

    const emptyCart =
        document.getElementById(
            "emptyCart"
        );

    const cartItemCount =
        document.getElementById(
            "cartItemCount"
        );


    if (!cartItemsContainer) {
        return;
    }


    const user =
        getCartLoggedInUser();


    const cart =
        getUserCart();


    cartItemsContainer.innerHTML =
        "";


    /* ======================================================
       NO LOGGED-IN USER
       Shows a login message when no user is logged in.
    ===================================== ====*/

    if (!user) {

        if (emptyCart) {

            emptyCart.hidden =
                false;


            const title =
                emptyCart.querySelector(
                    "h2"
                );


            const message =
                emptyCart.querySelector(
                    "p"
                );


            const link =
                emptyCart.querySelector(
                    "a"
                );


            if (title) {

                title.textContent =
                    "Please Login to View Your Cart";

            }


            if (message) {

                message.textContent =
                    "Login to access your personal shopping cart.";

            }


            if (link) {

                link.textContent =
                    "Go to Login";


                link.href =
                    "login.html";

            }

        }


        if (cartItemCount) {

            cartItemCount.textContent =
                "0 items";

        }


        updateSummary([]);

        return;

    }


    /* ==============================================================
       EMPTY CART
       Shows a message when the user's shopping cart is empty.
    =================================================== */

    if (cart.length === 0) {

        if (emptyCart) {

            emptyCart.hidden =
                false;


            const title =
                emptyCart.querySelector(
                    "h2"
                );


            const message =
                emptyCart.querySelector(
                    "p"
                );


            const link =
                emptyCart.querySelector(
                    "a"
                );


            if (title) {

                title.textContent =
                    "Your cart is empty";

            }


            if (message) {

                message.textContent =
                    "Discover something beautiful from our jewelry collection.";

            }


            if (link) {

                link.textContent =
                    "Continue Shopping";


                link.href =
                    "shop.html";

            }

        }


        if (cartItemCount) {

            cartItemCount.textContent =
                "0 items";

        }


        updateSummary([]);

        return;

    }


    /* =============================================================
       CART HAS ITEMS
       Shows all cart products and calculates the total quantity.
    ==================================================== */

    if (emptyCart) {

        emptyCart.hidden =
            true;

    }


    let totalItems =
        0;


    cart.forEach(
        function(item, index) {

            const quantity =
                Math.max(
                    1,
                    Number(
                        item.quantity
                    ) || 1
                );


            totalItems +=
                quantity;


            const itemElement =
                document.createElement(
                    "article"
                );


            itemElement.className =
                "cart-item";


            itemElement.innerHTML = `

                <img
                    class="cart-item-image"
                    src="${escapeHTML(
                        item.image || ""
                    )}"
                    alt="${escapeHTML(
                        item.name || "Jewelry"
                    )}"
                    onerror="this.style.visibility='hidden';"
                >

                <div class="cart-item-info">

                    <h3>
                        ${escapeHTML(
                            item.name ||
                            "Jewelry"
                        )}
                    </h3>

                    <p class="cart-item-category">
                        ${escapeHTML(
                            item.category ||
                            "Jewelry"
                        )}
                    </p>

                </div>

                <div class="cart-item-price">
                    ${formatPrice(
                        item.price
                    )}
                </div>

                <div class="quantity-control">

                    <button
                        type="button"
                        class="quantity-button"
                        data-action="decrease"
                        data-index="${index}"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>

                    <span class="quantity-value">
                        ${quantity}
                    </span>

                    <button
                        type="button"
                        class="quantity-button"
                        data-action="increase"
                        data-index="${index}"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>

                </div>

                <div class="cart-item-total">
                    ${formatPrice(
                        Number(
                            item.price
                        ) * quantity
                    )}
                </div>

                <button
                    type="button"
                    class="remove-item"
                    data-action="remove"
                    data-index="${index}"
                    aria-label="Remove item"
                >
                    🗑
                </button>

            `;


            cartItemsContainer.appendChild(
                itemElement
            );

        }
    );


    if (cartItemCount) {

        cartItemCount.textContent =
            `${totalItems} ${
                totalItems === 1
                    ? "item"
                    : "items"
            }`;

    }


    updateSummary(
        cart
    );

}


/* ==========================================================================
   UPDATE SUMMARY
   Calculates the subtotal and total price and updates the checkout button.
========================================= ====================*/

function updateSummary(cart) {

    const subtotalElement =
        document.getElementById(
            "cartSubtotal"
        );


    const shippingElement =
        document.getElementById(
            "cartShipping"
        );


    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    const checkoutButton =
        document.getElementById(
            "checkoutButton"
        );


    let subtotal =
        0;


    cart.forEach(
        function(item) {

            const price =
                Number(
                    item.price
                ) || 0;


            const quantity =
                Math.max(
                    1,
                    Number(
                        item.quantity
                    ) || 1
                );


            subtotal +=
                price * quantity;

        }
    );


    /* Free shipping */

    const shipping =
        0;


    const total =
        subtotal +
        shipping;


    if (subtotalElement) {

        subtotalElement.textContent =
            formatPrice(
                subtotal
            );

    }


    if (shippingElement) {

        shippingElement.textContent =
            "Free";

    }


    if (totalElement) {

        totalElement.textContent =
            formatPrice(
                total
            );

    }


    if (checkoutButton) {

        checkoutButton.disabled =
            cart.length === 0;

    }

}


/* =================================================================
   CART ACTIONS
   Handles clicks on the increase, decrease, and remove buttons.
=======================================================*/

function handleCartAction(event) {

    const button =
        event.target.closest(
            "[data-action]"
        );


    if (!button) {
        return;
    }


    const index =
        Number(
            button.dataset.index
        );


    const action =
        button.dataset.action;


    if (!Number.isInteger(index)) {
        return;
    }


    const cart =
        getUserCart();


    if (!cart[index]) {
        return;
    }


    /* =======================================================
       INCREASE
       Increases the selected product's quantity by one.
    ============================================= */

    if (
        action ===
        "increase"
    ) {

        cart[index].quantity =
            (
                Number(
                    cart[index].quantity
                ) || 1
            ) + 1;

    }


    /* ===============================================================================
       DECREASE
       Decreases the product quantity or removes it when the quantity reaches one.
    ==================================================================== */

    if (
        action ===
        "decrease"
    ) {

        const currentQuantity =
            Number(
                cart[index].quantity
            ) || 1;


        if (
            currentQuantity >
            1
        ) {

            cart[index].quantity =
                currentQuantity - 1;

        } else {

            cart.splice(
                index,
                1
            );

        }

    }


    /* =======================================================
       REMOVE
       Removes the selected product from the shopping cart.
    ============================================== */

    if (
        action ===
        "remove"
    ) {

        cart.splice(
            index,
            1
        );

    }


    saveUserCart(
        cart
    );

}


/* ==========================================================================
   UPDATE NAVBAR CART COUNT
    Updates the shopping cart item count displayed in the navigation bar.
================================================================*/

function updateNavbarCartCount() {

    const cartCount =
        document.querySelector(
            ".cart-count"
        );


    if (!cartCount) {
        return;
    }


    const user =
        getCartLoggedInUser();


    /* No logged-in user */

    if (!user) {

        cartCount.textContent =
            "0";

        return;

    }


    const cart =
        getUserCart();


    const totalItems =
        cart.reduce(
            function(
                total,
                item
            ) {

                return total +
                    (
                        Number(
                            item.quantity
                        ) || 1
                    );

            },
            0
        );


    cartCount.textContent =
        totalItems;

}


/* =================================================================
   UPDATE CART PAGE
   Refreshes the cart products and the navigation bar cart count.
========================================= ===============*/

function updateCartPage() {

    renderCart();

    updateNavbarCartCount();

}


/* =======================================================================
   CHECKOUT
   Checks login and cart status before redirecting the user to checkout.
============================================================ */

function goToCheckout() {

    const user =
        getCartLoggedInUser();


    if (!user) {

        alert(
            "Please login before proceeding to checkout."
        );


        window.location.href =
            "login.html";


        return;

    }


    const cart =
        getUserCart();


    if (
        cart.length ===
        0
    ) {

        alert(
            "Your cart is empty."
        );


        return;

    }


    window.location.href =
        "payment.html";

}


/* ==============================================================================
   LOGIN / LOGOUT CHANGES
   Refreshes the cart when the login status changes in another browser tab.
============================================================ */

window.addEventListener(
    "storage",
    function(event) {

        if (
            event.key ===
            "luxuryJewelryLoggedInUser"
        ) {

            updateCartPage();

        }

    }
);


/* =====================================================================
   CART UPDATED EVENT
   Refreshes the cart whenever the cartUpdated event is triggered.
====================================================== */

window.addEventListener(
    "cartUpdated",
    function() {

        updateCartPage();

    }
);


/* ===============================================================
   VISIBILITY CHANGE
   Updates the cart when the browser tab becomes visible again.
========================================================*/

document.addEventListener(
    "visibilitychange",
    function() {

        if (
            document.visibilityState ===
            "visible"
        ) {

            updateCartPage();

        }

    }
);


/* =====================================================================================
   INITIALIZE
   Initializes the cart page and attaches click events after the HTML has loaded.
==================================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const cartItems =
            document.getElementById(
                "cartItems"
            );


        if (cartItems) {

            cartItems.addEventListener(
                "click",
                handleCartAction
            );

        }


        const checkoutButton =
            document.getElementById(
                "checkoutButton"
            );


        if (checkoutButton) {

            checkoutButton.addEventListener(
                "click",
                goToCheckout
            );

        }


        updateCartPage();

    }
);