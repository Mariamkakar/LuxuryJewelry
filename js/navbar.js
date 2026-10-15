/* =====================================================
   LUXURY JEWELRY - NAVBAR JAVASCRIPT
   Handles navigation, authentication, search, theme,
   account menu, cart count, and favorites count.
===================================================== */


/* =====================================================
   1. LOAD NAVBAR
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    const navbarContainer = document.getElementById("navbar");

    if (!navbarContainer) return;

    // Restore the saved theme.
    const savedTheme = localStorage.getItem("luxuryJewelryTheme");
    document.body.classList.toggle("dark-mode", savedTheme === "dark");

    // Load the shared navbar.
    fetch("components/navbar.html")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Navbar file could not be loaded.");
            }

            return response.text();
        })
        .then(function (data) {
            navbarContainer.innerHTML = data;
            initializeNavbar();
        })
        .catch(function (error) {
            console.error("Navbar Error:", error);
        });
});


/* =====================================================
   2. INITIALIZE NAVBAR
===================================================== */

function initializeNavbar() {
    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a").forEach(function (link) {
        const href = (link.getAttribute("href") || "")
            .split("?")[0]
            .split("#")[0]
            .split("/")
            .pop();

        if (href === currentPage) {
            link.classList.add("active");
        }
    });

    initializeNavbarAuthProtection();
    initializeMobileMenu();
    initializeThemeToggle();
    setupSearch();
    initializeAccount();

    updateCartCount();
    updateFavoriteCount();
}


/* =====================================================
   3. AUTHENTICATION HELPERS
===================================================== */

function getNavbarLoggedInUser() {
    try {
        const savedUser = localStorage.getItem(
            "luxuryJewelryLoggedInUser"
        );

        if (!savedUser) return null;

        const user = JSON.parse(savedUser);

        return user && typeof user === "object" ? user : null;
    } catch (error) {
        console.error("Logged-in user error:", error);
        return null;
    }
}

function isNavbarLoggedIn() {
    return !!getNavbarLoggedInUser();
}

function getNavbarCurrentUserKey() {
    const user = getNavbarLoggedInUser();

    if (!user) return null;

    const userId = user.id || user.userId || user.email;

    if (!userId) return null;

    return String(userId)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "_");
}

function getNavbarProfileStorageKey() {
    const userKey = getNavbarCurrentUserKey();

    return userKey
        ? "luxuryJewelryProfile_" + userKey
        : null;
}


/* =====================================================
   4. AUTHENTICATION NOTIFICATION
===================================================== */

function showNavbarAuthMessage(message) {
    let notification = document.getElementById(
        "luxuryAuthNotification"
    );

    if (!notification) {
        notification = document.createElement("div");
        notification.id = "luxuryAuthNotification";
        notification.className = "luxury-auth-notification";
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.classList.add("show");

    if (notification.hideTimer) {
        clearTimeout(notification.hideTimer);
    }

    notification.hideTimer = setTimeout(function () {
        notification.classList.remove("show");
    }, 2500);
}


/* =====================================================
   5. PROTECT PRIVATE PAGES
===================================================== */

function initializeNavbarAuthProtection() {
    const protectedPages = [
        "cart.html",
        "wishlist.html",
        "favorites.html",
        "saved-jobs.html",
        "account.html",
        "profile.html"
    ];

    document.querySelectorAll("a[href]").forEach(function (link) {
        const href = link.getAttribute("href");

        if (
            !href ||
            href.startsWith("#") ||
            href.startsWith("javascript:")
        ) {
            return;
        }

        const linkPage = href
            .split("?")[0]
            .split("#")[0]
            .split("/")
            .pop()
            .toLowerCase();

        if (!protectedPages.includes(linkPage)) return;

        if (link.dataset.authGuardAdded === "true") return;

        link.dataset.authGuardAdded = "true";

        link.addEventListener("click", function (event) {
            if (isNavbarLoggedIn()) return;

            event.preventDefault();
            event.stopPropagation();

            showNavbarAuthMessage(
                "Please login to access this feature."
            );
        });
    });
}


/* =====================================================
   6. MOBILE MENU
===================================================== */

function initializeMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const navLinksContainer = document.getElementById("navLinks");

    if (!menuToggle || !navLinksContainer) return;

    if (menuToggle.dataset.menuHandlerAdded === "true") return;

    menuToggle.dataset.menuHandlerAdded = "true";

    menuToggle.addEventListener("click", function () {
        const isOpen = navLinksContainer.classList.toggle("active");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close Menu" : "Open Menu"
        );
    });

    navLinksContainer.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navLinksContainer.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open Menu");
        });
    });
}


/* =====================================================
   7. DARK / LIGHT MODE
===================================================== */

function initializeThemeToggle() {
    const themeToggle = document.getElementById("themeToggle");

    if (!themeToggle) return;

    function updateThemeIcon() {
        const isDark = document.body.classList.contains("dark-mode");

        themeToggle.textContent = isDark ? "☀" : "☾";

        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Switch to Light Mode" : "Switch to Dark Mode"
        );
    }

    updateThemeIcon();

    if (themeToggle.dataset.themeHandlerAdded === "true") return;

    themeToggle.dataset.themeHandlerAdded = "true";

    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        const isDark = document.body.classList.contains("dark-mode");

        localStorage.setItem(
            "luxuryJewelryTheme",
            isDark ? "dark" : "light"
        );

        updateThemeIcon();
    });
}


/* =====================================================
   8. SEARCH
===================================================== */

function setupSearch() {
    const searchBtn = document.getElementById("searchBtn");
    const searchOverlay = document.getElementById("searchOverlay");
    const searchBackdrop = document.getElementById("searchBackdrop");
    const closeSearch = document.getElementById("closeSearch");
    const searchInput = document.getElementById("navbarSearchInput");
    const clearSearch = document.getElementById("clearSearch");

    if (!searchBtn || !searchOverlay || !searchInput) return;

    if (searchBtn.dataset.searchHandlerAdded === "true") return;

    searchBtn.dataset.searchHandlerAdded = "true";

    function openSearchPanel() {
        searchOverlay.classList.add("active");
        searchOverlay.setAttribute("aria-hidden", "false");
        document.body.classList.add("search-open");

        searchBtn.setAttribute("aria-expanded", "true");

        setTimeout(function () {
            searchInput.focus();
        }, 250);
    }

    function closeSearchPanel() {
        searchOverlay.classList.remove("active");
        searchOverlay.setAttribute("aria-hidden", "true");
        document.body.classList.remove("search-open");

        searchBtn.setAttribute("aria-expanded", "false");
        searchInput.value = "";

        if (clearSearch) {
            clearSearch.classList.remove("visible");
        }
    }

    function performSearch(query) {
        const value = query.trim();

        if (!value) {
            searchInput.focus();
            return;
        }

        window.location.href =
            "shop.html?search=" + encodeURIComponent(value);
    }

    searchBtn.addEventListener("click", openSearchPanel);

    if (closeSearch) {
        closeSearch.addEventListener("click", closeSearchPanel);
    }

    if (searchBackdrop) {
        searchBackdrop.addEventListener("click", closeSearchPanel);
    }

    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            searchOverlay.classList.contains("active")
        ) {
            closeSearchPanel();
        }
    });

    searchInput.addEventListener("input", function () {
        if (!clearSearch) return;

        clearSearch.classList.toggle(
            "visible",
            searchInput.value.trim() !== ""
        );
    });

    if (clearSearch) {
        clearSearch.addEventListener("click", function () {
            searchInput.value = "";
            clearSearch.classList.remove("visible");
            searchInput.focus();
        });
    }

    document.querySelectorAll(".popular-searches button").forEach(
        function (button) {
            button.addEventListener("click", function () {
                performSearch(button.dataset.search || "");
            });
        }
    );

    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            performSearch(searchInput.value);
        }
    });
}


/* =====================================================
   9. ACCOUNT MENU AND AUTOMATIC LOGOUT
===================================================== */

function initializeAccount() {
    const accountMenu = document.getElementById("accountMenu");
    const accountButton = document.getElementById("accountButton");
    const accountDropdown = document.getElementById("accountDropdown");

    if (!accountMenu || !accountButton || !accountDropdown) {
        console.warn("Account elements were not found in navbar.html.");
        return;
    }

    const user = getNavbarLoggedInUser();
    const isLoggedIn = Boolean(user);

    const loginNavLink = document.getElementById("loginNavLink");
    const signupNavLink = document.getElementById("signupNavLink");
    const accountLoginLink = document.getElementById("accountLoginLink");
    const accountSignupLink = document.getElementById("accountSignupLink");
    const profileNavLink = document.getElementById("profileNavLink");
    const logoutButton = document.getElementById("logoutButton");

    // Keep the account icon visible.
    accountMenu.style.display = "";

    // Show or hide the login and signup links.
    if (loginNavLink) {
        loginNavLink.hidden = isLoggedIn;
        loginNavLink.style.display = isLoggedIn ? "none" : "";
    }

    if (signupNavLink) {
        signupNavLink.hidden = isLoggedIn;
        signupNavLink.style.display = isLoggedIn ? "none" : "";
    }

    if (accountLoginLink) {
        accountLoginLink.hidden = isLoggedIn;
        accountLoginLink.style.display = isLoggedIn ? "none" : "";
    }

    if (accountSignupLink) {
        accountSignupLink.hidden = isLoggedIn;
        accountSignupLink.style.display = isLoggedIn ? "none" : "";
    }

    // Show the profile link only when logged in.
    if (profileNavLink) {
        profileNavLink.hidden = !isLoggedIn;
        profileNavLink.style.display = isLoggedIn ? "" : "none";
    }

    // Show the logout button only when logged in.
    if (logoutButton) {
        logoutButton.hidden = !isLoggedIn;
        logoutButton.style.display = isLoggedIn ? "" : "none";
    }

    // Close the dropdown when refreshing account information.
    accountDropdown.hidden = true;
    accountDropdown.classList.remove("active");
    accountButton.setAttribute("aria-expanded", "false");

    // Update the account photo or default icon.
    if (isLoggedIn) {
        updateAccountProfilePhoto();
    } else {
        resetAccountButton();
    }

    // Register the account button click handler once.
    if (accountButton.dataset.accountHandlerAdded !== "true") {
        accountButton.dataset.accountHandlerAdded = "true";

        accountButton.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (!isNavbarLoggedIn()) {
                window.location.href = "login.html";
                return;
            }

            const isOpen =
                accountButton.getAttribute("aria-expanded") === "true";

            accountDropdown.hidden = isOpen;
            accountDropdown.classList.toggle("active", !isOpen);

            accountButton.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );
        });
    }

    // Close the dropdown when clicking outside.
    if (accountMenu.dataset.outsideClickHandlerAdded !== "true") {
        accountMenu.dataset.outsideClickHandlerAdded = "true";

        document.addEventListener("click", function (event) {
            if (!accountMenu.contains(event.target)) {
                accountDropdown.hidden = true;
                accountDropdown.classList.remove("active");
                accountButton.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Automatically log out without a confirmation message.
    if (
        logoutButton &&
        logoutButton.dataset.logoutHandlerAdded !== "true"
    ) {
        logoutButton.dataset.logoutHandlerAdded = "true";

        logoutButton.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            // Remove the current login session.
            localStorage.removeItem("luxuryJewelryLoggedInUser");
            localStorage.removeItem("luxuryJewelryRememberMe");

            // Notify other features about the logout.
            window.dispatchEvent(new Event("loginStatusChanged"));

            // Redirect to the homepage immediately.
            window.location.href = "index.html";
        });
    }
}


/* =====================================================
   10. RESET ACCOUNT BUTTON
===================================================== */

function resetAccountButton() {
    const accountButton = document.getElementById("accountButton");

    if (!accountButton) return;

    accountButton.innerHTML = `
        <span class="account-icon" id="accountIcon">
            <i class="fa-solid fa-user" aria-hidden="true"></i>
        </span>
    `;

    accountButton.classList.remove("has-avatar");
    accountButton.setAttribute("aria-label", "Account");
}


/* =====================================================
   11. UPDATE ACCOUNT PROFILE PHOTO
===================================================== */

function updateAccountProfilePhoto() {
    const accountButton = document.getElementById("accountButton");
    const user = getNavbarLoggedInUser();

    if (!accountButton) return;

    if (!user) {
        resetAccountButton();
        return;
    }

    let photo = "";

    const profileKey = getNavbarProfileStorageKey();

    if (profileKey) {
        try {
            const savedProfile = localStorage.getItem(profileKey);

            const profile = savedProfile
                ? JSON.parse(savedProfile)
                : null;

            if (profile && profile.photo) {
                photo = profile.photo;
            }
        } catch (error) {
            console.error("Profile photo error:", error);
        }
    }

    // Use the signup photo when no profile photo exists.
    if (!photo) {
        photo = user.profileImage || user.photo || "";
    }

    const displayName =
        user.fullName ||
        user.name ||
        user.email ||
        "My Account";

    if (!photo) {
        resetAccountButton();

        accountButton.setAttribute(
            "aria-label",
            "Account: " + displayName
        );

        return;
    }

    const avatar = document.createElement("img");

    avatar.src = photo;
    avatar.className = "account-avatar visible";
    avatar.id = "accountAvatar";
    avatar.alt = "Profile";

    avatar.onerror = function () {
        resetAccountButton();

        accountButton.setAttribute(
            "aria-label",
            "Account: " + displayName
        );
    };

    accountButton.replaceChildren(avatar);
    accountButton.classList.add("has-avatar");

    accountButton.setAttribute(
        "aria-label",
        "Account: " + displayName
    );
}


/* =====================================================
   12. REFRESH NAVBAR DATA
===================================================== */

// Refresh the profile photo after it changes.
window.addEventListener("profilePhotoUpdated", function () {
    updateAccountProfilePhoto();
});

// Refresh the cart after products change.
window.addEventListener("cartUpdated", function () {
    updateCartCount();
});

// Refresh favorites after items change.
window.addEventListener("favoritesUpdated", function () {
    updateFavoriteCount();
});

// Refresh account information after login or logout.
window.addEventListener("loginStatusChanged", function () {
    initializeAccount();
    updateCartCount();
    updateFavoriteCount();
});

// Detect changes made in other browser tabs.
window.addEventListener("storage", function (event) {
    if (event.key === "luxuryJewelryLoggedInUser") {
        initializeAccount();
        updateCartCount();
        updateFavoriteCount();
        return;
    }

    if (event.key === getNavbarProfileStorageKey()) {
        updateAccountProfilePhoto();
    }

    if (
        event.key &&
        event.key.startsWith("luxuryJewelryFavorites_")
    ) {
        updateFavoriteCount();
    }

    if (
        event.key &&
        event.key.startsWith("luxuryJewelryCart_")
    ) {
        updateCartCount();
    }
});

// Refresh navbar information when returning to the page.
document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
        updateCartCount();
        updateFavoriteCount();
        updateAccountProfilePhoto();
    }
});


/* =====================================================
   13. UPDATE CART COUNT
===================================================== */

function updateCartCount() {
    const cartCountElements = document.querySelectorAll(
        ".cart-count, #cartCount, [data-cart-count]"
    );

    const user = getNavbarLoggedInUser();
    const userKey = getNavbarCurrentUserKey();

    let cart = [];

    if (user && userKey) {
        try {
            cart = JSON.parse(
                localStorage.getItem(
                    "luxuryJewelryCart_" + userKey
                ) || "[]"
            );

            if (!Array.isArray(cart)) cart = [];
        } catch (error) {
            cart = [];
        }
    }

    const count = cart.reduce(function (total, item) {
        return total + (Number(item.quantity) || 1);
    }, 0);

    cartCountElements.forEach(function (element) {
        element.textContent = count;
    });
}


/* =====================================================
   14. UPDATE FAVORITES COUNT
===================================================== */

function updateFavoriteCount() {
    const favoriteCountElements = document.querySelectorAll(
        ".favorite-count, #favoriteCount, [data-favorite-count]"
    );

    const userKey = getNavbarCurrentUserKey();
    let favorites = [];

    if (userKey) {
        try {
            favorites = JSON.parse(
                localStorage.getItem(
                    "luxuryJewelryFavorites_" + userKey
                ) || "[]"
            );

            if (!Array.isArray(favorites)) favorites = [];
        } catch (error) {
            favorites = [];
        }
    }

    favoriteCountElements.forEach(function (element) {
        element.textContent = favorites.length;
    });
}