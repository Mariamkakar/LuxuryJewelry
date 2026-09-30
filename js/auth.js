/* =====================================================
   LUXURY JEWELRY
   AUTHENTICATION JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CHECK LOGIN
    ===================================================== */

    const checkLogin = () => {
        return !!localStorage.getItem(
            "luxuryJewelryLoggedInUser"
        );
    };


    /* =====================================================
       PROTECTED PAGES
       These pages do not open before Login.
    ===================================================== */

    const protectedPages = [
        "shop.html",
        "collections.html",
        "collection.html",
        "product-details.html",
        "about.html",
        "faq.html",
        "shipping-returns.html",
        "contact.html",
        "cart.html",
        "wishlist.html",
        "favorites.html",
        "account.html",
        "profile.html"
    ];


    /* =====================================================
       PUBLIC PAGES
       These pages are always accessible.
    ===================================================== */

    const publicPages = [
        "",
        "index.html",
        "login.html",
        "signup.html"
    ];


    /* =====================================================
       CHECK CURRENT PAGE
    ===================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    /* =====================================================
       PROTECTED PAGE REDIRECT
       Prevents direct access before Login.
    ===================================================== */

    if (
        !checkLogin() &&
        protectedPages.includes(currentPage)
    ) {

        localStorage.setItem(
            "luxuryJewelryLoginMessage",
            "Please login to access this page."
        );

        window.location.replace(
            "login.html"
        );

        return;
    }


    /* =====================================================
       PROTECTED LINKS
       These links do not open before Login.
    ===================================================== */

    document
        .querySelectorAll("a")
        .forEach((link) => {

            const href =
                link.getAttribute("href");

            if (!href) {
                return;
            }

            const linkPage =
                href
                    .split("?")[0]
                    .split("#")[0]
                    .split("/")
                    .pop()
                    .toLowerCase();


            if (
                protectedPages.includes(
                    linkPage
                )
            ) {

                link.addEventListener(
                    "click",
                    (event) => {

                        if (!checkLogin()) {

                            event.preventDefault();
                            event.stopPropagation();

                            showAuthMessage(
                                "Please login to access this page."
                            );

                            return false;
                        }

                    },
                    true
                );
            }

        });


    /* =====================================================
       PROTECTED NAVBAR ACTIONS
       Search, Favorites, Cart and Account
       do not work before Login.
    ===================================================== */

    if (!checkLogin()) {


        /* =================================================
           SEARCH
        ================================================== */

        const searchButton =
            document.querySelector("#searchBtn");

        if (searchButton) {

            searchButton.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();
                    event.stopPropagation();

                    showAuthMessage(
                        "Please login to use Search."
                    );

                    return false;

                },
                true
            );

        }


        /* =================================================
           FAVORITES
        ================================================== */

        const favoriteButton =
            document.querySelector(".wishlist-icon");

        if (favoriteButton) {

            favoriteButton.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();
                    event.stopPropagation();

                    showAuthMessage(
                        "Please login to use Favorites."
                    );

                    return false;

                },
                true
            );

        }


        /* =================================================
           CART
        ================================================== */

        const cartButton =
            document.querySelector(".cart-icon");

        if (cartButton) {

            cartButton.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();
                    event.stopPropagation();

                    showAuthMessage(
                        "Please login to use your Cart."
                    );

                    return false;

                },
                true
            );

        }


        /* =================================================
           ACCOUNT
        ================================================== */

        const accountButton =
            document.querySelector("#accountButton");

        if (accountButton) {

            accountButton.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();
                    event.stopPropagation();

                    showAuthMessage(
                        "Please login to access your account."
                    );

                    return false;

                },
                true
            );

        }

    }


    /* =====================================================
       LOGIN MESSAGE
    ===================================================== */

    const loginMessage =
        localStorage.getItem(
            "luxuryJewelryLoginMessage"
        );


    if (
        loginMessage &&
        currentPage === "login.html"
    ) {

        showAuthMessage(
            loginMessage
        );

        localStorage.removeItem(
            "luxuryJewelryLoginMessage"
        );

    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    const logoutButtons =
        document.querySelectorAll(
            "#logoutBtn, #logoutButton, .logout-btn"
        );


    logoutButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    localStorage.removeItem(
                        "luxuryJewelryLoggedInUser"
                    );

                    localStorage.removeItem(
                        "luxuryJewelryTheme"
                    );

                    /*
                       Do not remove user carts here.
                       Each user's cart is stored separately.
                    */

                    window.location.href =
                        "login.html";

                }
            );

        }
    );


    /* =====================================================
       AUTH STATUS
    ===================================================== */

    if (checkLogin()) {

        document.body.classList.add(
            "user-logged-in"
        );

        document.body.classList.remove(
            "user-logged-out"
        );

    } else {

        document.body.classList.add(
            "user-logged-out"
        );

        document.body.classList.remove(
            "user-logged-in"
        );

    }


    /* =====================================================
       ACCOUNT USER
    ===================================================== */

    const accountElements =
        document.querySelectorAll(
            ".account-user"
        );


    if (checkLogin()) {

        const savedUser =
            localStorage.getItem(
                "luxuryJewelryLoggedInUser"
            );


        accountElements.forEach(
            (element) => {

                try {

                    const user =
                        JSON.parse(savedUser);

                    element.textContent =
                        user.fullName ||
                        user.email ||
                        "My Account";

                } catch (error) {

                    element.textContent =
                        savedUser ||
                        "My Account";

                }

            }
        );

    }


    /* =====================================================
       AUTHENTICATION COMPLETE
    ===================================================== */

    console.log(
        checkLogin()
            ? "Luxury Jewelry Auth: User is logged in."
            : "Luxury Jewelry Auth: User is logged out."
    );


    /* =====================================================
       AUTH MESSAGE
    ===================================================== */

    function showAuthMessage(message) {

        let notification =
            document.getElementById(
                "luxuryAuthNotification"
            );


        if (!notification) {

            notification =
                document.createElement(
                    "div"
                );

            notification.id =
                "luxuryAuthNotification";

            notification.className =
                "luxury-auth-notification";

            document.body.appendChild(
                notification
            );

        }


        notification.textContent =
            message;


        notification.classList.add(
            "show"
        );


        clearTimeout(
            notification.hideTimer
        );


        notification.hideTimer =
            setTimeout(
                () => {

                    notification.classList.remove(
                        "show"
                    );

                },
                2500
            );

    }

});