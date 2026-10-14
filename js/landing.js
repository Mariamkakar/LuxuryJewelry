/* =====================================================
   LUXURY JEWELRY
   LANDING PAGE JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       AUTHENTICATION
       Checks the current user's login status.
    ===================================================== */

    const checkLogin = () => {
        return !!localStorage.getItem("luxuryJewelryLoggedInUser");
    };

    const getLoggedInUser = () => {
        const userData = localStorage.getItem(
            "luxuryJewelryLoggedInUser"
        );

        if (!userData) return null;

        try {
            return JSON.parse(userData);
        } catch (error) {
            console.error("Invalid logged-in user data.");
            return null;
        }
    };

    /* Creates a unique storage key for each user. */
    const getUserKey = () => {
        const user = getLoggedInUser();

        if (!user) return null;

        const uniqueId = user.id || user.userId || user.email;

        if (!uniqueId) return null;

        return String(uniqueId)
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "_");
    };

    /* =====================================================
       NOTIFICATIONS
       Displays temporary messages on the page.
    ===================================================== */

    function showNotification(message) {
        let notification = document.getElementById(
            "luxuryNotification"
        );

        if (!notification) {
            notification = document.createElement("div");
            notification.id = "luxuryNotification";
            notification.className = "luxury-notification";
            document.body.appendChild(notification);
        }

        notification.textContent = message;
        notification.classList.add("show");

        clearTimeout(notification.hideTimer);

        notification.hideTimer = setTimeout(() => {
            notification.classList.remove("show");
        }, 2500);
    }

    const requireLogin = (event, message) => {
        if (checkLogin()) return true;

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        showNotification(
            message || "Please login to access this feature."
        );

        return false;
    };
    

    /* =====================================================
       SEARCH
       Search works for all visitors.
    ===================================================== */

    const searchBtn = document.getElementById("searchBtn");
    const searchBox = document.getElementById("searchBox");
    const closeSearch = document.getElementById("closeSearch");
    const homeSearch = document.getElementById("homeSearch");

    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            if (searchBox) {
                searchBox.classList.add("active");

                if (homeSearch) {
                    setTimeout(() => homeSearch.focus(), 100);
                }
            }
        });
    }

    if (closeSearch) {
        closeSearch.addEventListener("click", () => {
            if (searchBox) searchBox.classList.remove("active");
            if (homeSearch) homeSearch.value = "";
        });
    }

    if (homeSearch) {
        homeSearch.addEventListener("keydown", (event) => {
            if (event.key !== "Enter") return;

            const searchValue = homeSearch.value.trim();

            if (!searchValue) {
                showNotification("Please enter something to search.");
                return;
            }

            window.location.href =
                "shop.html?search=" +
                encodeURIComponent(searchValue);
        });
    }

    /* =====================================================
       USER-SPECIFIC SHOPPING CART
       Each user has a separate cart.
    ===================================================== */

    const getCartStorageKey = () => {
        const userKey = getUserKey();

        return userKey
            ? `luxuryJewelryCart_${userKey}`
            : null;
    };

    const getCart = () => {
        const storageKey = getCartStorageKey();

        if (!storageKey) return [];

        try {
            const cart = JSON.parse(
                localStorage.getItem(storageKey) || "[]"
            );

            return Array.isArray(cart) ? cart : [];
        } catch (error) {
            console.error("Invalid cart data.");
            return [];
        }
    };

    const saveCart = (cart) => {
        const storageKey = getCartStorageKey();

        if (!storageKey) return;

        localStorage.setItem(
            storageKey,
            JSON.stringify(cart)
        );

        window.dispatchEvent(new Event("cartUpdated"));
    };

    /* Displays zero when no user is logged in. */
    const updateCartCount = () => {
        const totalItems = checkLogin()
            ? getCart().reduce((total, item) => {
                return total + (Number(item.quantity) || 1);
            }, 0)
            : 0;

        document.querySelectorAll(".cart-count").forEach((counter) => {
            counter.textContent = totalItems;
        });
    };

    /* =====================================================
       USER-SPECIFIC FAVORITES
       Each user has a separate favorites list.
    ===================================================== */

    const getFavoritesStorageKey = () => {
        const userKey = getUserKey();

        return userKey
            ? `luxuryJewelryFavorites_${userKey}`
            : null;
    };

    const getFavorites = () => {
        if (!checkLogin()) return [];

        const storageKey = getFavoritesStorageKey();

        if (!storageKey) return [];

        try {
            const favorites = JSON.parse(
                localStorage.getItem(storageKey) || "[]"
            );

            return Array.isArray(favorites) ? favorites : [];
        } catch (error) {
            console.error("Invalid favorites data.");
            return [];
        }
    };

    const saveFavorites = (favorites) => {
        if (!checkLogin()) return;

        const storageKey = getFavoritesStorageKey();

        if (!storageKey) return;

        localStorage.setItem(
            storageKey,
            JSON.stringify(favorites)
        );

        window.dispatchEvent(new Event("favoritesUpdated"));
    };

    /* Updates the Navbar favorite counter. */
    const updateFavoriteCount = () => {
        const totalFavorites = checkLogin()
            ? getFavorites().length
            : 0;

        document.querySelectorAll(
            ".favorite-count, .wishlist-count, .favorites-count"
        ).forEach((counter) => {
            counter.textContent = totalFavorites;
        });

        /* Allows navbar.js or favorite.js to refresh its own counter. */
        window.dispatchEvent(new CustomEvent("favoritesCountChanged", {
            detail: { count: totalFavorites }
        }));
    };

    /* Updates product heart icons for the current user. */
    const updateFavoriteButtons = () => {
        const favorites = getFavorites();

        document.querySelectorAll(".wishlist-btn").forEach((button) => {
            const name = button.dataset.name;

            const exists = checkLogin() && favorites.some(
                (item) => item.name === name
            );

            button.classList.toggle("active", exists);
            button.textContent = exists ? "♥" : "♡";

            button.setAttribute(
                "aria-label",
                exists
                    ? `Remove ${name} from Favorites`
                    : `Add ${name} to Favorites`
            );
        });

        updateFavoriteCount();
        updateProtectedButtons();
    };

    /* =====================================================
       PRODUCT BUTTON LOCK
       Favorite and Add to Cart require login.
    ===================================================== */

    const updateProtectedButtons = () => {
        const isLoggedIn = checkLogin();

        document.querySelectorAll(
            ".add-cart-btn, .wishlist-btn"
        ).forEach((button) => {
            const productCard = button.closest(
                ".product-card, .featured-product-card"
            );

            if (!productCard) {
                button.classList.remove("login-required");
                button.removeAttribute("aria-disabled");
                return;
            }

            button.classList.toggle(
                "login-required",
                !isLoggedIn
            );

            button.setAttribute(
                "aria-disabled",
                String(!isLoggedIn)
            );

            button.title = isLoggedIn
                ? ""
                : "Please login to use this feature.";
        });
    };

    /* =====================================================
       ADD TO CART
       Saves products only for the logged-in user.
    ===================================================== */

    document.querySelectorAll(".add-cart-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (!requireLogin(
                event,
                "Please login to add products to your cart."
            )) {
                return;
            }

            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            const image = button.dataset.image || "";

            if (!name || Number.isNaN(price)) {
                showNotification("Product information is missing.");
                return;
            }

            const cart = getCart();

            const existingProduct = cart.find(
                (item) => item.name === name
            );

            if (existingProduct) {
                existingProduct.quantity =
                    (Number(existingProduct.quantity) || 1) + 1;
            } else {
                cart.push({
                    id: Date.now(),
                    name,
                    price,
                    image,
                    quantity: 1
                });
            }

            saveCart(cart);
            updateCartCount();

            showNotification(`${name} added to your cart.`);
        });
    });

    /* =====================================================
       FAVORITE BUTTONS
       Adds or removes favorites for the current user.
    ===================================================== */

    document.querySelectorAll(".wishlist-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (!requireLogin(
                event,
                "Please login to use Favorites."
            )) {
                return;
            }

            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            const image = button.dataset.image || "";

            if (!name) {
                showNotification("Product information is missing.");
                return;
            }

            const favorites = getFavorites();

            const existingIndex = favorites.findIndex(
                (item) => item.name === name
            );

            if (existingIndex !== -1) {
                favorites.splice(existingIndex, 1);

                showNotification(
                    `${name} removed from favorites.`
                );
            } else {
                favorites.push({
                    id: Date.now(),
                    name,
                    price: Number.isNaN(price) ? 0 : price,
                    image
                });

                showNotification(
                    `${name} added to favorites.`
                );
            }

            saveFavorites(favorites);
            updateFavoriteButtons();
        });
    });

    /* =====================================================
       NEWSLETTER
       Allows visitors to subscribe without login.
    ===================================================== */

    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterEmail = document.getElementById("newsletterEmail");

    if (newsletterForm && newsletterEmail) {
        newsletterForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const email = newsletterEmail.value.trim();

            if (!email) {
                showNotification("Please enter your email.");
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                showNotification("Please enter a valid email address.");
                return;
            }

            let subscribers = [];

            try {
                const savedSubscribers = JSON.parse(
                    localStorage.getItem("luxuryJewelrySubscribers") || "[]"
                );

                subscribers = Array.isArray(savedSubscribers)
                    ? savedSubscribers
                    : [];
            } catch (error) {
                subscribers = [];
            }

            if (subscribers.includes(email)) {
                showNotification("You are already subscribed.");
                return;
            }

            subscribers.push(email);

            localStorage.setItem(
                "luxuryJewelrySubscribers",
                JSON.stringify(subscribers)
            );

            showNotification(
                "Thank you for subscribing to Luxury Jewelry!"
            );

            newsletterForm.reset();
        });
    }

    /* =====================================================
       IMAGE FALLBACK
       Hides images that fail to load.
    ===================================================== */

    document.querySelectorAll("img").forEach((image) => {
        image.addEventListener("error", () => {
            image.style.display = "none";
        });
    });

    /* =====================================================
       SCROLL REVEAL
       Reveals sections and cards on scroll.
    ===================================================== */

    const revealElements = document.querySelectorAll(
        ".section-header, .product-card, .category-card, " +
        ".about-content, .newsletter-content"
    );

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach((element) => {
            element.classList.add("reveal");
            observer.observe(element);
        });
    }

    /* =====================================================
       LOGIN / LOGOUT EVENTS
       Refreshes counts and hearts after account changes.
    ===================================================== */

    const refreshUserInterface = () => {
        updateCartCount();
        updateFavoriteButtons();
        updateProtectedButtons();
    };

    window.addEventListener("loginStatusChanged", refreshUserInterface);
    window.addEventListener("favoritesUpdated", updateFavoriteCount);
    window.addEventListener("cartUpdated", updateCartCount);

    window.addEventListener("storage", (event) => {
        if (
            event.key === "luxuryJewelryLoggedInUser" ||
            event.key === getCartStorageKey() ||
            event.key === getFavoritesStorageKey()
        ) {
            refreshUserInterface();
        }
    });

    /* =====================================================
       INITIALIZE
       Shows data for the current user only.
    ===================================================== */

    refreshUserInterface();

    console.log(
        checkLogin()
            ? "Luxury Jewelry: User is logged in."
            : "Luxury Jewelry: User is logged out."
    );

});