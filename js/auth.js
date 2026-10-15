/* =====================================================
   LUXURY JEWELRY
   AUTHENTICATION JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CHECK LOGIN
       Checks whether a user is logged in using localStorage.
    ===================================================== */

    function checkLogin() {
        return !!localStorage.getItem(
            "luxuryJewelryLoggedInUser"
        );
    }
    


    /* =====================================================
       PROTECTED PAGES
       Stores the pages that require users to log in.
    ===================================================== */

    const protectedPages = [

        "cart.html",
        "wishlist.html",
        "favorites.html",
        "account.html",
        "profile.html"
    ];


    /* =====================================================
       CURRENT PAGE
       Gets the current page name from the URL.
    ===================================================== */

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();


    /* =====================================================
       REDIRECT TO LOGIN
       Saves a message and redirects the user to login.html.
    ===================================================== */

    function redirectToLogin(message) {
        localStorage.setItem(
            "luxuryJewelryLoginMessage",
            message || "Please login to access this page."
        );

        window.location.href = "login.html";
    }


    /* =====================================================
       PROTECT DIRECT PAGE ACCESS
       Redirects logged-out users from protected pages.
    ===================================================== */

    if (
        !checkLogin() &&
        protectedPages.includes(currentPage)
    ) {
        redirectToLogin(
            "Please login to access this page."
            
        );

        return;
    }


    /* =====================================================
       PROTECT LINKS
       Prevents logged-out users from opening protected links.
    ===================================================== */

    function protectLink(link) {
        if (!link || link.dataset.authGuard === "true") {
            return;
        }

        const href = link.getAttribute("href");

        if (
            !href ||
            href.startsWith("#") ||
            href.startsWith("javascript:")
        ) {
            return;
        }

        let linkPage = "";

        try {
            linkPage = new URL(
                href,
                window.location.href
            ).pathname
                .split("/")
                .pop()
                .toLowerCase();
        } catch (error) {
            return;
        }

        if (!protectedPages.includes(linkPage)) {
            return;
        }

        link.dataset.authGuard = "true";

        link.addEventListener("click", (event) => {
            if (checkLogin()) {
                return;
            }

            event.preventDefault();
            event.stopImmediatePropagation();

            redirectToLogin(
                "Please login to access this page."
            );
        }, true);
    }


    /* =====================================================
       FIND EXISTING LINKS
       Finds all links on the page and checks their access.
    ===================================================== */

    function protectExistingLinks() {
        document.querySelectorAll("a").forEach((link) => {
            protectLink(link);
        });
    }

    protectExistingLinks();


    /* =====================================================
       HANDLE DYNAMICALLY LOADED NAVBAR
       Detects new navbar links and protects them automatically.
    ===================================================== */

    const navbarContainer = document.getElementById("navbar");

    if (navbarContainer) {
        const navbarObserver = new MutationObserver(() => {
            protectExistingLinks();
        });

        navbarObserver.observe(navbarContainer, {
            childList: true,
            subtree: true
        });
    }


    /* =====================================================
       PROTECT CART BUTTON
       Requires users to log in before using the cart button.
    ===================================================== */

    function protectAction(selector, message) {
        document.querySelectorAll(selector).forEach((element) => {
            if (element.dataset.authActionGuard === "true") {
                return;
            }

            element.dataset.authActionGuard = "true";

            element.addEventListener("click", (event) => {
                if (checkLogin()) {
                    return;
                }

                event.preventDefault();
                event.stopImmediatePropagation();

                redirectToLogin(message);
            }, true);
        });
    }

    protectAction(
        ".cart-icon",
        "Please login to use your Cart."
    );


    /* =====================================================
       PROTECT FAVORITES BUTTON
       Requires users to log in before opening Favorites.
    ===================================================== */

    protectAction(
        ".wishlist-icon",
        "Please login to use Favorites."
    );


    /* =====================================================
       PROTECT PROFILE LINK
       Protects profile links, including dynamically added links.
    ===================================================== */

    function protectProfileLink() {
        document.querySelectorAll(
            "#profileNavLink, a[href='profile.html'], a[href='./profile.html']"
        ).forEach((link) => {
            protectLink(link);
        });
    }

    protectProfileLink();

    if (navbarContainer) {
        const profileObserver = new MutationObserver(() => {
            protectProfileLink();
            protectAction(
                ".cart-icon",
                "Please login to use your Cart."
            );
            protectAction(
                ".wishlist-icon",
                "Please login to use Favorites."
            );
        });

        profileObserver.observe(navbarContainer, {
            childList: true,
            subtree: true
        });
    }


    /* =====================================================
       LOGIN MESSAGE
       Shows the saved message when the login page opens.
    ===================================================== */

    const loginMessage = localStorage.getItem(
        "luxuryJewelryLoginMessage"
    );

    if (loginMessage && currentPage === "login.html") {
        showAuthMessage(loginMessage);

        localStorage.removeItem(
            "luxuryJewelryLoginMessage"
        );

    }


    /* =============================================================
       LOGOUT
       Removes the saved login information and opens login.html.
    ===================================================== */

    const logoutButtons = document.querySelectorAll(
        "#logoutBtn, #logoutButton, .logout-btn"
    );

    logoutButtons.forEach((button) => {
        if (button.dataset.logoutGuard === "true") {
            return;
        }

        button.dataset.logoutGuard = "true";

        button.addEventListener("click", (event) => {
            event.preventDefault();

            localStorage.removeItem(
                "luxuryJewelryLoggedInUser"
            );

            window.location.href = "login.html";
        });
    });


    /* =====================================================
       AUTH STATUS
       Adds a CSS class to the body based on login status.
    ===================================================== */

    if (checkLogin()) {
        document.body.classList.add("user-logged-in");
        document.body.classList.remove("user-logged-out");
    } else {
        document.body.classList.add("user-logged-out");
        document.body.classList.remove("user-logged-in");
    }


    /* =====================================================
       ACCOUNT USER NAME
       Shows the logged-in user's name or email.
    ===================================================== */

    const accountElements = document.querySelectorAll(
        ".account-user"
    );


    if (checkLogin()) {
        const savedUser = localStorage.getItem(
            "luxuryJewelryLoggedInUser"
        );

        let userName = "My Account";

        try {
            const user = JSON.parse(savedUser);

            userName =
                user.fullName ||
                user.name ||
                user.email ||
                "My Account";
        } catch (error) {
            userName = savedUser || "My Account";
        }

        accountElements.forEach((element) => {
            element.textContent = userName;
        });
    }


    /* =====================================================
       AUTHENTICATION STATUS LOG
       Prints the current login status in the browser console.
    ===================================================== */

    console.log(
        checkLogin()
            ? "Luxury Jewelry Auth: User is logged in."
            : "Luxury Jewelry Auth: User is logged out."
    );


    /* =====================================================
       AUTH MESSAGE
       Creates and shows a temporary notification message.
    ===================================================== */

    function showAuthMessage(message) {
        let notification = document.getElementById(
            "luxuryAuthNotification"
        );


        if (!notification) {
            notification = document.createElement("div");
            notification.id = "luxuryAuthNotification";
            notification.className =
                "luxury-auth-notification";

            document.body.appendChild(notification);
        }


        notification.textContent = message;
        notification.classList.add("show");

        clearTimeout(notification.hideTimer);

        notification.hideTimer = setTimeout(() => {
            notification.classList.remove("show");
        }, 2500);
    }

});