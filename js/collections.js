/* =====================================================
   LUXURY JEWELRY
  This part is collection page javascript
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =======================================================================================
       CART COUNT
    Get the cart data from localStorage and show the total number of products in the cart.
    ========================================================================================*/

    const cartCountElements =
        document.querySelectorAll(".cart-count");

    let cart = [];

    try {

        cart =
            JSON.parse(
                localStorage.getItem("luxuryJewelryCart")
            ) || [];

    } catch (error) {

        cart = [];

    }


    let totalItems = 0;

    cart.forEach((item) => {

        totalItems += Number(item.quantity) || 1;

    });


    cartCountElements.forEach((element) => {

        element.textContent = totalItems;

    });


    /* ===============================================================================
       COLLECTION BUTTONS
       Get the Explore buttons and navigate to their linked pages when clicked.
    ================================================================================*/

    const exploreButtons =
        document.querySelectorAll(".explore-btn");


    exploreButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const destination =
                button.getAttribute("href");

            if (destination) {

                window.location.href = destination;

            }

        });

    });

});