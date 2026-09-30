/* ========================================
   LOAD NAVBAR
======================================== */

document.addEventListener("DOMContentLoaded", function () {

    const navbarContainer =
        document.getElementById("navbar");

    if (!navbarContainer) {
        return;
    }


    /* ------------------------------------
       LOAD SAVED THEME
    ------------------------------------ */

    const savedTheme =
        localStorage.getItem("luxuryJewelryTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }


    /* ------------------------------------
       LOAD NAVBAR HTML
    ------------------------------------ */

    fetch("components/navbar.html")
        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Navbar file could not be loaded."
                );
            }

            return response.text();

        })
        .then(function (data) {

            navbarContainer.innerHTML = data;

            /*
               IMPORTANT:
               Navbar is loaded dynamically.
               All Navbar functions must run
               AFTER navbar.html is inserted.
            */

            initializeNavbar();

        })
        .catch(function (error) {

            console.error(
                "Navbar Error:",
                error
            );

        });

});


/* ========================================
   NAVBAR FUNCTIONS
======================================== */

function initializeNavbar() {

    const currentPage =
        window.location.pathname.split("/").pop() ||
        "index.html";


    /* ------------------------------------
       ACTIVE NAV LINK
    ------------------------------------ */

    const navLinks =
        document.querySelectorAll(".nav-links a");

    navLinks.forEach(function (link) {

        const linkPage =
            link.getAttribute("href");

        if (linkPage === currentPage) {

            link.classList.add("active");

        }

    });


    /* ------------------------------------
       AUTH PROTECTION
       MUST RUN AFTER NAVBAR LOADS
    ------------------------------------ */

    initializeNavbarAuthProtection();


    /* ------------------------------------
       MOBILE MENU
    ------------------------------------ */

    const menuToggle =
        document.getElementById("menuToggle");

    const navLinksContainer =
        document.getElementById("navLinks");

    if (menuToggle && navLinksContainer) {

        menuToggle.addEventListener(
            "click",
            function () {

                navLinksContainer.classList.toggle(
                    "active"
                );

                const isOpen =
                    navLinksContainer.classList.contains(
                        "active"
                    );

                menuToggle.setAttribute(
                    "aria-label",
                    isOpen
                        ? "Close Menu"
                        : "Open Menu"
                );

            }
        );


        navLinksContainer
            .querySelectorAll("a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        navLinksContainer.classList.remove(
                            "active"
                        );

                        menuToggle.setAttribute(
                            "aria-label",
                            "Open Menu"
                        );

                    }
                );

            });

    }


    /* ------------------------------------
       DARK / LIGHT MODE
    ------------------------------------ */

    const themeToggle =
        document.getElementById("themeToggle");

    if (themeToggle) {

        const isDark =
            document.body.classList.contains(
                "dark-mode"
            );

        themeToggle.textContent =
            isDark ? "☀" : "☾";


        themeToggle.addEventListener(
            "click",
            function () {

                document.body.classList.toggle(
                    "dark-mode"
                );

                const darkMode =
                    document.body.classList.contains(
                        "dark-mode"
                    );

                localStorage.setItem(
                    "luxuryJewelryTheme",
                    darkMode
                        ? "dark"
                        : "light"
                );

                themeToggle.textContent =
                    darkMode ? "☀" : "☾";

            }
        );

    }


    /* ------------------------------------
       SEARCH
    ------------------------------------ */

    setupSearch();


    /* ------------------------------------
       ACCOUNT
    ------------------------------------ */

    initializeAccount();


    /* ------------------------------------
       CART COUNT
    ------------------------------------ */

    updateCartCount();


    /* ------------------------------------
       FAVORITES COUNT
    ------------------------------------ */

    updateFavoriteCount();

}


/* ========================================
   AUTH PROTECTION FOR NAVBAR
======================================== */

function initializeNavbarAuthProtection() {

    const loggedInUser =
        getNavbarLoggedInUser();

    const isLoggedIn =
        !!loggedInUser;


    /*
       Login and Sign Up are ALWAYS allowed.
    */


    /* ------------------------------------
       PROTECTED NAVIGATION LINKS
    ------------------------------------ */

    const protectedPages = [
        "index.html",
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


    if (!isLoggedIn) {

        /*
           Protect navbar links.
           Login and Sign Up are excluded.
        */

        document
            .querySelectorAll(".nav-links a")
            .forEach(function (link) {

                const href =
                    link.getAttribute("href");

                if (!href) {
                    return;
                }


                /*
                   Login and Sign Up
                   remain accessible.
                */

                if (
                    link.id === "loginNavLink" ||
                    link.id === "signupNavLink"
                ) {
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
                        function (event) {

                            event.preventDefault();
                            event.stopPropagation();

                            showNavbarAuthMessage(
                                "Please login to access this page."
                            );

                            return false;

                        },
                        true
                    );

                }

            });


        /* --------------------------------
           LOGO / HOME
        -------------------------------- */

        const navbarLogo =
            document.querySelector(
                ".navbar-logo"
            );

        if (navbarLogo) {

            navbarLogo.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    showNavbarAuthMessage(
                        "Please login to access Home."
                    );

                    return false;

                },
                true
            );

        }


        /* --------------------------------
           SEARCH
        -------------------------------- */

        const searchButton =
            document.getElementById("searchBtn");

        if (searchButton) {

            searchButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    showNavbarAuthMessage(
                        "Please login to use Search."
                    );

                    return false;

                },
                true
            );

        }


        /* --------------------------------
           FAVORITES
        -------------------------------- */

        const favoriteButton =
            document.querySelector(
                ".wishlist-icon"
            );

        if (favoriteButton) {

            favoriteButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    showNavbarAuthMessage(
                        "Please login to use Favorites."
                    );

                    return false;

                },
                true
            );

        }


        /* --------------------------------
           CART
        -------------------------------- */

        const cartButton =
            document.querySelector(
                ".cart-icon"
            );

        if (cartButton) {

            cartButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    showNavbarAuthMessage(
                        "Please login to use your Cart."
                    );

                    return false;

                },
                true
            );

        }


        /* --------------------------------
           ACCOUNT
        -------------------------------- */

        const accountButton =
            document.getElementById(
                "accountButton"
            );

        if (accountButton) {

            accountButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    showNavbarAuthMessage(
                        "Please login to access your account."
                    );

                    return false;

                },
                true
            );

        }

    }

}


/* ========================================
   AUTH MESSAGE
======================================== */

function showNavbarAuthMessage(message) {

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
            function () {

                notification.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* ========================================
   SEARCH FUNCTIONS
======================================== */

function setupSearch() {

    const searchBtn =
        document.getElementById("searchBtn");

    const searchOverlay =
        document.getElementById("searchOverlay");

    const searchBackdrop =
        document.getElementById("searchBackdrop");

    const closeSearch =
        document.getElementById("closeSearch");

    const searchInput =
        document.getElementById(
            "navbarSearchInput"
        );

    const clearSearch =
        document.getElementById("clearSearch");


    if (
        !searchBtn ||
        !searchOverlay ||
        !searchInput
    ) {

        console.warn(
            "Navbar Search elements were not found."
        );

        return;

    }


    /* ------------------------------------
       OPEN SEARCH
    ------------------------------------ */

    searchBtn.addEventListener(
        "click",
        function () {

            /*
               Do not open Search
               if user is not logged in.
            */

            if (!getNavbarLoggedInUser()) {

                showNavbarAuthMessage(
                    "Please login to use Search."
                );

                return;

            }


            searchOverlay.classList.add(
                "active"
            );

            document.body.classList.add(
                "search-open"
            );


            setTimeout(
                function () {

                    searchInput.focus();

                },
                250
            );

        }
    );


    /* ------------------------------------
       CLOSE SEARCH
    ------------------------------------ */

    function closeSearchPanel() {

        searchOverlay.classList.remove(
            "active"
        );

        document.body.classList.remove(
            "search-open"
        );

        searchInput.value = "";


        if (clearSearch) {

            clearSearch.classList.remove(
                "visible"
            );

        }

    }


    if (closeSearch) {

        closeSearch.addEventListener(
            "click",
            function () {

                closeSearchPanel();

            }
        );

    }


    if (searchBackdrop) {

        searchBackdrop.addEventListener(
            "click",
            function () {

                closeSearchPanel();

            }
        );

    }


    /* ------------------------------------
       ESC KEY
    ------------------------------------ */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                searchOverlay.classList.contains(
                    "active"
                )
            ) {

                closeSearchPanel();

            }

        }
    );


    /* ------------------------------------
       SEARCH INPUT
    ------------------------------------ */

    searchInput.addEventListener(
        "input",
        function () {

            if (!clearSearch) {
                return;
            }


            if (
                searchInput.value.trim() !== ""
            ) {

                clearSearch.classList.add(
                    "visible"
                );

            } else {

                clearSearch.classList.remove(
                    "visible"
                );

            }

        }
    );


    /* ------------------------------------
       CLEAR SEARCH
    ------------------------------------ */

    if (clearSearch) {

        clearSearch.addEventListener(
            "click",
            function () {

                searchInput.value = "";

                clearSearch.classList.remove(
                    "visible"
                );

                searchInput.focus();

            }
        );

    }


    /* ------------------------------------
       POPULAR SEARCHES
    ------------------------------------ */

    const popularButtons =
        document.querySelectorAll(
            ".popular-searches button"
        );


    popularButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    if (!getNavbarLoggedInUser()) {

                        showNavbarAuthMessage(
                            "Please login to use Search."
                        );

                        return;

                    }


                    const value =
                        button.dataset.search || "";


                    if (!value.trim()) {
                        return;
                    }


                    window.location.href =
                        "shop.html?search=" +
                        encodeURIComponent(
                            value.trim()
                        );

                }
            );

        }
    );


    /* ------------------------------------
       ENTER KEY SEARCH
    ------------------------------------ */

    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Enter") {
                return;
            }


            if (!getNavbarLoggedInUser()) {

                showNavbarAuthMessage(
                    "Please login to use Search."
                );

                return;

            }


            const query =
                searchInput.value.trim();


            if (!query) {
                return;
            }


            window.location.href =
                "shop.html?search=" +
                encodeURIComponent(query);

        }
    );

}


/* ========================================
   GET LOGGED IN USER
======================================== */

function getNavbarLoggedInUser() {

    try {

        const savedUser =
            localStorage.getItem(
                "luxuryJewelryLoggedInUser"
            );


        if (!savedUser) {
            return null;
        }


        return JSON.parse(savedUser);

    } catch (error) {

        console.error(
            "Logged in user error:",
            error
        );

        return null;

    }

}


/* ========================================
   GET CURRENT USER KEY
======================================== */

function getNavbarCurrentUserKey() {

    const user =
        getNavbarLoggedInUser();


    if (!user) {
        return null;
    }


    const userId =
        user.id ||
        user.userId ||
        user.email;


    if (!userId) {
        return null;
    }


    return String(userId)
        .trim()
        .toLowerCase()
        .replace(
            /[^a-z0-9_-]/g,
            "_"
        );

}


/* ========================================
   GET CURRENT USER PROFILE KEY
======================================== */

function getNavbarProfileStorageKey() {

    const userKey =
        getNavbarCurrentUserKey();


    if (!userKey) {
        return null;
    }


    return (
        "luxuryJewelryProfile_" +
        userKey
    );

}


/* ========================================
   ACCOUNT FUNCTIONS
======================================== */

function initializeAccount() {

    const loginNavLink =
        document.getElementById(
            "loginNavLink"
        );

    const signupNavLink =
        document.getElementById(
            "signupNavLink"
        );

    const accountMenu =
        document.getElementById(
            "accountMenu"
        );

    const accountButton =
        document.getElementById(
            "accountButton"
        );

    const accountDropdown =
        document.getElementById(
            "accountDropdown"
        );

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    const loggedInUser =
        getNavbarLoggedInUser();


    const isLoggedIn =
        !!loggedInUser;


    /* ------------------------------------
       NOT LOGGED IN
    ------------------------------------ */

    if (!isLoggedIn) {

        if (loginNavLink) {

            loginNavLink.style.display = "";

        }


        if (signupNavLink) {

            signupNavLink.style.display = "";

        }


        if (accountMenu) {

            accountMenu.style.display = "none";

        }


        resetAccountButton();

        return;

    }


    /* ------------------------------------
       LOGGED IN
    ------------------------------------ */

    if (loginNavLink) {

        loginNavLink.style.display = "none";

    }


    if (signupNavLink) {

        signupNavLink.style.display = "none";

    }


    if (accountMenu) {

        accountMenu.style.display = "flex";

    }


    /* ------------------------------------
       PROFILE PHOTO
    ------------------------------------ */

    updateAccountProfilePhoto();


    /* ------------------------------------
       ACCOUNT DROPDOWN
    ------------------------------------ */

    if (
        accountButton &&
        accountDropdown
    ) {

        accountButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                accountDropdown.classList.toggle(
                    "active"
                );


                const isOpen =
                    accountDropdown.classList.contains(
                        "active"
                    );


                accountButton.setAttribute(
                    "aria-expanded",
                    isOpen
                        ? "true"
                        : "false"
                );

            }
        );

    }


    /* ------------------------------------
       LOGOUT
    ------------------------------------ */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                if (accountDropdown) {

                    accountDropdown.classList.remove(
                        "active"
                    );

                }


                if (accountButton) {

                    accountButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }


                localStorage.removeItem(
                    "luxuryJewelryLoggedInUser"
                );


                resetAccountButton();


                window.location.href =
                    "index.html";

            }
        );

    }


    /* ------------------------------------
       CLOSE ACCOUNT DROPDOWN
    ------------------------------------ */

    document.addEventListener(
        "click",
        function (event) {

            if (
                accountMenu &&
                !accountMenu.contains(
                    event.target
                )
            ) {

                if (accountDropdown) {

                    accountDropdown.classList.remove(
                        "active"
                    );

                }


                if (accountButton) {

                    accountButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }

        }
    );

}


/* ========================================
   RESET ACCOUNT BUTTON
======================================== */

function resetAccountButton() {

    const accountButton =
        document.getElementById(
            "accountButton"
        );


    if (!accountButton) {
        return;
    }


    accountButton.innerHTML = `
        <span
            class="account-icon"
            id="accountIcon"
        >
            👤
        </span>
    `;


    accountButton.classList.remove(
        "has-avatar"
    );


    accountButton.setAttribute(
        "aria-label",
        "Account"
    );

}


/* ========================================
   UPDATE ACCOUNT PROFILE PHOTO
======================================== */

function updateAccountProfilePhoto() {

    const accountButton =
        document.getElementById(
            "accountButton"
        );


    if (!accountButton) {
        return;
    }


    const loggedInUser =
        getNavbarLoggedInUser();


    if (!loggedInUser) {

        resetAccountButton();

        return;

    }


    const profileKey =
        getNavbarProfileStorageKey();


    if (!profileKey) {

        resetAccountButton();

        return;

    }


    let profile = null;


    try {

        profile =
            JSON.parse(
                localStorage.getItem(
                    profileKey
                )
            );

    } catch (error) {

        console.error(
            "Profile data error:",
            error
        );

        profile = null;

    }


    const profilePhoto =
        profile &&
        profile.photo
            ? profile.photo
            : "";


    if (profilePhoto) {

        accountButton.innerHTML = `
            <img
                src="${profilePhoto}"
                class="account-avatar visible"
                id="accountAvatar"
                alt="Profile"
            >
        `;


        accountButton.classList.add(
            "has-avatar"
        );


        accountButton.setAttribute(
            "aria-label",
            "Profile"
        );

    } else {

        resetAccountButton();

    }

}


/* ========================================
   PROFILE PHOTO UPDATE EVENT
======================================== */

window.addEventListener(
    "profilePhotoUpdated",
    function () {

        updateAccountProfilePhoto();

    }
);


/* ========================================
   PROFILE PHOTO FROM OTHER TABS
======================================== */

window.addEventListener(
    "storage",
    function (event) {

        const currentProfileKey =
            getNavbarProfileStorageKey();


        if (
            currentProfileKey &&
            event.key === currentProfileKey
        ) {

            updateAccountProfilePhoto();

        }


        if (
            event.key ===
            "luxuryJewelryLoggedInUser"
        ) {

            const loggedInUser =
                getNavbarLoggedInUser();


            if (loggedInUser) {

                updateAccountProfilePhoto();

            } else {

                resetAccountButton();

            }

        }

    }
);


/* ========================================
   GET CURRENT USER CART KEY
======================================== */

function getNavbarCartStorageKey() {

    const userKey =
        getNavbarCurrentUserKey();


    if (!userKey) {
        return null;
    }


    return (
        "luxuryJewelryCart_" +
        userKey
    );

}


/* ========================================
   UPDATE CART COUNT
======================================== */

function updateCartCount() {

    const cartCounts =
        document.querySelectorAll(
            ".cart-count"
        );


    if (!cartCounts.length) {
        return;
    }


    const storageKey =
        getNavbarCartStorageKey();


    /*
       No logged-in user:
       Cart count must be 0.
    */

    if (!storageKey) {

        cartCounts.forEach(
            function (counter) {

                counter.textContent = "0";

            }
        );

        return;

    }


    try {

        const cart =
            JSON.parse(
                localStorage.getItem(
                    storageKey
                )
            ) || [];


        const totalItems =
            cart.reduce(
                function (total, item) {

                    return total +
                        (
                            Number(
                                item.quantity
                            ) || 1
                        );

                },
                0
            );


        cartCounts.forEach(
            function (counter) {

                counter.textContent =
                    totalItems;

            }
        );


    } catch (error) {

        cartCounts.forEach(
            function (counter) {

                counter.textContent = "0";

            }
        );


        console.error(
            "Cart count error:",
            error
        );

    }

}


/* ========================================
   UPDATE FAVORITES COUNT
======================================== */

function updateFavoriteCount() {

    const favoriteCounts =
        document.querySelectorAll(
            ".wishlist-count"
        );


    if (!favoriteCounts.length) {
        return;
    }


    try {

        const favorites =
            JSON.parse(
                localStorage.getItem(
                    "luxuryJewelryFavorites"
                )
            ) || [];


        const totalFavorites =
            favorites.length;


        favoriteCounts.forEach(
            function (counter) {

                counter.textContent =
                    totalFavorites;

            }
        );


    } catch (error) {

        favoriteCounts.forEach(
            function (counter) {

                counter.textContent = "0";

            }
        );


        console.error(
            "Favorites count error:",
            error
        );

    }

}


/* ========================================
   UPDATE FAVORITES WHEN IT CHANGES
======================================== */

window.addEventListener(
    "favoritesUpdated",
    function () {

        updateFavoriteCount();

    }
);


/* ========================================
   UPDATE FAVORITES FROM OTHER TABS
======================================== */

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key ===
            "luxuryJewelryFavorites"
        ) {

            updateFavoriteCount();

        }


        /*
           Update Cart when another tab
           changes the current user's cart.
        */

        const currentCartKey =
            getNavbarCartStorageKey();


        if (
            currentCartKey &&
            event.key === currentCartKey
        ) {

            updateCartCount();

        }

    }
);


/* ========================================
   UPDATE CART WHEN IT CHANGES
======================================== */

window.addEventListener(
    "cartUpdated",
    function () {

        updateCartCount();

    }
);


/* ========================================
   UPDATE COUNTS WHEN PAGE BECOMES VISIBLE
======================================== */

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState ===
            "visible"
        ) {

            updateCartCount();

            updateFavoriteCount();

            updateAccountProfilePhoto();

        }

    }
);