/* =====================================================
   LUXURY JEWELRY
   SHIPPING & RETURNS JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =============================================
        Get the HTML elements needed for the page
    ========================== */
    
    const body = document.body;

    const themeToggle = document.getElementById("themeToggle");
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.querySelector(".nav-links");

    const searchBtn = document.getElementById("searchBtn");
    const searchBox = document.getElementById("searchBox");
    const closeSearch = document.getElementById("closeSearch");
    const homeSearch = document.getElementById("homeSearch");

    const newsletterForm = document.getElementById("newsletterForm");

    const cartCountElements = document.querySelectorAll(".cart-count");


    /* ===============================================================
        Check and switch between the saved dark mode and light mode
    ===================================================== */
    

    const savedTheme = localStorage.getItem("luxuryJewelryTheme");

    if (savedTheme === "dark") {
        body.classList.add("dark-mode");

        if (themeToggle) {
            themeToggle.textContent = "☀";
        }
    } else {
        body.classList.remove("dark-mode");

        if (themeToggle) {
            themeToggle.textContent = "☾";
        }
    }


    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            body.classList.toggle("dark-mode");

            const isDark = body.classList.contains("dark-mode");

            localStorage.setItem(
                "luxuryJewelryTheme",
                isDark ? "dark" : "light"
            );

            themeToggle.textContent = isDark ? "☀" : "☾";

        });

    }


    /* =====================================================
        Open and close the mobile navigation menu
    ===================================================== */
    
    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {

            navLinks.classList.toggle("active");
            menuToggle.classList.toggle("active");

        });



        const navItems = navLinks.querySelectorAll("a");

        navItems.forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("active");
                menuToggle.classList.remove("active");

            });

        });

    }


    /* ===============================================================
       Open and close the search box when the user interacts with it

    ===================================================== */
    
    if (searchBtn && searchBox) {

        searchBtn.addEventListener("click", () => {

            searchBox.classList.add("active");

            if (homeSearch) {
                homeSearch.focus();
            }

        });

    }


    if (closeSearch && searchBox) {

        closeSearch.addEventListener("click", () => {

            searchBox.classList.remove("active");

        });

    }


    // بستن Search با کلید Escape

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            if (searchBox) {
                searchBox.classList.remove("active");
            }

            if (navLinks) {
                navLinks.classList.remove("active");
            }

        }

    });


    /* =====================================================
      Search for products when the user enters a search term
    ===================================================== */
    

    if (homeSearch) {

        homeSearch.addEventListener("keydown", (event) => {

            if (event.key === "Enter") {

                const searchValue = homeSearch.value.trim();

                if (searchValue !== "") {

                    window.location.href =
                        `shop.html?search=${encodeURIComponent(searchValue)}`;

                }

            }

        });

    }


    /* ==============================================================
    // Calculate and display the total number of items in the cart
    ===================================================== */


    function updateCartCount() {

        let cart = JSON.parse(
            localStorage.getItem("luxuryJewelryCart")
        ) || [];

        let totalItems = 0;

        cart.forEach(item => {

            totalItems += Number(item.quantity) || 1;

        });

        cartCountElements.forEach(element => {

            element.textContent = totalItems;

        });

    }

    updateCartCount();


    /* =====================================================
        Handle newsletter subscription and show a success message
    ===================================================== */
    

    if (newsletterForm) {

        newsletterForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const emailInput = newsletterForm.querySelector(
                'input[type="email"]'
            );

            if (emailInput && emailInput.value.trim() !== "") {

                alert(
                    "Thank you for subscribing to Luxury Jewelry!"
                );

                newsletterForm.reset();

            }

        });

    }


    /* ======================================================
        Highlight the navigation link for the current page
    ===================================================== */
    

    const currentPage = window.location.pathname
        .split("/")
        .pop();

    const navItems = document.querySelectorAll(".nav-links a");

    navItems.forEach(link => {

        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {

            link.classList.add("active");

        }

    });


    /* =======================================================
       Close the sear ch box when the user clicks outside it
    ===================================================== */
    

    document.addEventListener("click", (event) => {

        if (
            searchBox &&
            searchBox.classList.contains("active") &&
            !searchBox.contains(event.target) &&
            !searchBtn.contains(event.target)
        ) {

            searchBox.classList.remove("active");

        }

    });

});