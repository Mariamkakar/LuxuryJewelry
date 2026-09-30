/* =====================================================
   LUXURY JEWELRY
   LANDING PAGE JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       AUTHENTICATION
    ===================================================== */

    const checkLogin = () => {

        return !!localStorage.getItem(
            "luxuryJewelryLoggedInUser"
        );

    };


    /* =====================================================
       LOGIN MESSAGE
       Displays a message when the user is not logged in.
    ===================================================== */

    const requireLogin = (event, message) => {

        if (checkLogin()) {
            return true;
        }

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
       This section allows the user to open and use the
       search box. Navbar functionality is handled by
       navbar.js.
    ===================================================== */

    const searchBtn =
        document.getElementById(
            "searchBtn"
        );


    const searchBox =
        document.getElementById(
            "searchBox"
        );


    const closeSearch =
        document.getElementById(
            "closeSearch"
        );


    const homeSearch =
        document.getElementById(
            "homeSearch"
        );


    if (searchBtn) {

        searchBtn.addEventListener(
            "click",
            (event) => {

                if (!checkLogin()) {

                    requireLogin(
                        event,
                        "Please login to use Search."
                    );

                    return;

                }


                if (searchBox) {

                    searchBox.classList.add(
                        "active"
                    );

                    if (homeSearch) {

                        setTimeout(
                            () => {
                                homeSearch.focus();
                            },
                            100
                        );

                    }

                }

            }
        );

    }


    if (closeSearch) {

        closeSearch.addEventListener(
            "click",
            () => {

                if (searchBox) {

                    searchBox.classList.remove(
                        "active"
                    );

                }


                if (homeSearch) {

                    homeSearch.value = "";

                }

            }
        );

    }


    /* =====================================================
       SEARCH FUNCTION
       Searches for products when the user presses enter.
    ===================================================== */

    if (homeSearch) {

        homeSearch.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key !== "Enter"
                ) {
                    return;
                }


                if (!checkLogin()) {

                    requireLogin(
                        event,
                        "Please login to use Search."
                    );

                    return;

                }


                const searchValue =
                    homeSearch.value.trim();


                if (searchValue === "") {

                    showNotification(
                        "Please enter something to search."
                    );

                    return;

                }


                window.location.href =
                    "shop.html?search=" +
                    encodeURIComponent(
                        searchValue
                    );

            }
        );

    }


    /* =====================================================
       CART
       User-specific shopping cart
    ===================================================== */

    const getLoggedInUser = () => {

        const userData =
            localStorage.getItem(
                "luxuryJewelryLoggedInUser"
            );

        if (!userData) {
            return null;
        }

        try {

            return JSON.parse(
                userData
            );

        } catch (error) {

            console.error(
                "Invalid logged-in user data."
            );

            return null;

        }

    };


    const getUserKey = () => {

        const user =
            getLoggedInUser();

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

    };


    const getCartStorageKey = () => {

        const userKey =
            getUserKey();

        if (!userKey) {
            return null;
        }

        return `luxuryJewelryCart_${userKey}`;

    };


    const getCart = () => {

        const storageKey =
            getCartStorageKey();

        if (!storageKey) {
            return [];
        }

        try {

            return JSON.parse(
                localStorage.getItem(
                    storageKey
                )
            ) || [];

        } catch (error) {

            console.error(
                "Invalid cart data."
            );

            return [];

        }

    };


    const saveCart = (cart) => {

        const storageKey =
            getCartStorageKey();

        if (!storageKey) {
            return;
        }

        localStorage.setItem(
            storageKey,
            JSON.stringify(cart)
        );

        /* Update cart everywhere immediately */
        window.dispatchEvent(
            new CustomEvent(
                "cartUpdated"
            )
        );

    };


    const updateCartCount = () => {

        const cart =
            getCart();


        const totalItems =
            cart.reduce(
                (total, item) => {

                    return total +
                        (
                            Number(
                                item.quantity
                            ) || 1
                        );

                },
                0
            );


        document
            .querySelectorAll(
                ".cart-count"
            )
            .forEach(
                (counter) => {

                    counter.textContent =
                        totalItems;

                }
            );

    };


    /* =====================================================
       ADD TO CART
       Just works after Login.
    ===================================================== */

    const addToCartBtns =
        document.querySelectorAll(
            ".add-cart-btn"
        );


    addToCartBtns.forEach(
        (button) => {

            button.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();
                    event.stopPropagation();


                    if (!checkLogin()) {

                        requireLogin(
                            event,
                            "Please login to add products to your cart."
                        );

                        return;

                    }


                    const name =
                        button.dataset.name;


                    const price =
                        parseFloat(
                            button.dataset.price
                        );


                    const image =
                        button.dataset.image || "";


                    if (
                        !name ||
                        isNaN(price)
                    ) {

                        showNotification(
                            "Product information is missing."
                        );

                        return;

                    }


                    const cart =
                        getCart();


                    const existingProduct =
                        cart.find(
                            (item) =>
                                item.name === name
                        );


                    if (existingProduct) {

                        existingProduct.quantity =
                            (
                                Number(
                                    existingProduct.quantity
                                ) || 1
                            ) + 1;

                    } else {

                        cart.push({

                            id: Date.now(),

                            name: name,

                            price: price,

                            image: image,

                            quantity: 1

                        });

                    }


                    saveCart(
                        cart
                    );

                    updateCartCount();


                    showNotification(
                        `${name} added to your cart.`
                    );

                }
            );

        }
    );


    /* =====================================================
       FAVORITES
       Handles favorites data, buttons, and saved products.
    ===================================================== */

    const getFavorites = () => {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "luxuryJewelryFavorites"
                )
            ) || [];

        } catch (error) {

            return [];

        }

    };


    const saveFavorites = (favorites) => {

        localStorage.setItem(
            "luxuryJewelryFavorites",
            JSON.stringify(
                favorites
            )
        );

    };


    const updateFavoriteButtons = () => {

        const favorites =
            getFavorites();


        document
            .querySelectorAll(
                ".wishlist-btn"
            )
            .forEach(
                (button) => {

                    const name =
                        button.dataset.name;


                    const exists =
                        favorites.some(
                            (item) =>
                                item.name === name
                        );


                    button.classList.toggle(
                        "active",
                        exists
                    );


                    button.textContent =
                        exists
                            ? "♡"
                            : "♡";


                    if (exists) {

                        button.setAttribute(
                            "aria-label",
                            `Remove ${name} from Favorites`
                        );

                    } else {

                        button.setAttribute(
                            "aria-label",
                            `Add ${name} to Favorites`
                        );

                    }

                }
            );

    };


    /* =====================================================
       FAVORITE BUTTON
       Just works after Login.
    ===================================================== */

    const favoriteButtons =
        document.querySelectorAll(
            ".wishlist-btn"
        );


    favoriteButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();
                    event.stopPropagation();


                    if (!checkLogin()) {

                        requireLogin(
                            event,
                            "Please login to use Favorites."
                        );

                        return;

                    }


                    const name =
                        button.dataset.name;


                    const price =
                        parseFloat(
                            button.dataset.price
                        );


                    const image =
                        button.dataset.image || "";


                    if (!name) {

                        return;

                    }


                    let favorites =
                        getFavorites();


                    const existingIndex =
                        favorites.findIndex(
                            (item) =>
                                item.name === name
                        );


                    if (
                        existingIndex !== -1
                    ) {

                        favorites.splice(
                            existingIndex,
                            1
                        );


                        showNotification(
                            `${name} removed from favorites.`
                        );

                    } else {

                        favorites.push({

                            id: Date.now(),

                            name: name,

                            price: price,

                            image: image

                        });


                        showNotification(
                            `${name} added to favorites.`
                        );

                    }


                    saveFavorites(
                        favorites
                    );


                    updateFavoriteButtons();


                    /* Update Navbar immediately */
                    window.dispatchEvent(
                        new Event(
                            "favoritesUpdated"
                        )
                    );

                }
            );

        }
    );


    /* =====================================================
       NOTIFICATION
    ===================================================== */

    const showNotification = (message) => {

        let notification =
            document.getElementById(
                "luxuryNotification"
            );


        if (!notification) {

            notification =
                document.createElement(
                    "div"
                );


            notification.id =
                "luxuryNotification";


            notification.className =
                "luxury-notification";


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

    };


    /* =====================================================
       NEWSLETTER
      THIS SEICTION DISABLED BEFORE LOGIN
    ===================================================== */

    const newsletterForm =
        document.getElementById(
            "newsletterForm"
        );


    const newsletterEmail =
        document.getElementById(
            "newsletterEmail"
        );


    if (newsletterForm) {

        if (!checkLogin()) {

            if (newsletterEmail) {

                newsletterEmail.disabled =
                    true;

            }


            const newsletterButton =
                newsletterForm.querySelector(
                    "button"
                );


            if (newsletterButton) {

                newsletterButton.disabled =
                    true;

                newsletterButton.style.opacity =
                    "0.5";

                newsletterButton.style.cursor =
                    "not-allowed";

            }


            newsletterForm.addEventListener(
                "submit",
                (event) => {

                    requireLogin(
                        event,
                        "Please login to subscribe to our newsletter."
                    );

                }
            );

        } else {

            newsletterForm.addEventListener(
                "submit",
                (event) => {

                    event.preventDefault();


                    const email =
                        newsletterEmail.value.trim();


                    if (email === "") {

                        showNotification(
                            "Please enter your email."
                        );

                        return;

                    }


                    const emailPattern =
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                    if (
                        !emailPattern.test(
                            email
                        )
                    ) {

                        showNotification(
                            "Please enter a valid email address."
                        );

                        return;

                    }


                    let subscribers =
                        [];


                    try {

                        subscribers =
                            JSON.parse(
                                localStorage.getItem(
                                    "luxuryJewelrySubscribers"
                                )
                            ) || [];

                    } catch (error) {

                        subscribers = [];

                    }


                    if (
                        !subscribers.includes(
                            email
                        )
                    ) {

                        subscribers.push(
                            email
                        );


                        localStorage.setItem(
                            "luxuryJewelrySubscribers",
                            JSON.stringify(
                                subscribers
                            )
                        );


                        showNotification(
                            "Thank you for subscribing to Luxury Jewelry!"
                        );

                    } else {

                        showNotification(
                            "You are already subscribed."
                        );

                    }


                    newsletterForm.reset();

                }
            );

        }

    }


    /* =====================================================
       PROTECTED NAVIGATION
       These pages do not open before Login.
    ===================================================== */

    const protectedLinks =
        document.querySelectorAll(
            'a[href="shop.html"],' +
            'a[href="collections.html"],' +
            'a[href="about.html"],' +
            'a[href="faq.html"],' +
            'a[href="shipping-returns.html"],' +
            'a[href="contact.html"],' +
            'a[href="cart.html"],' +
            'a[href="account.html"]'
        );


    protectedLinks.forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    if (!checkLogin()) {

                        requireLogin(
                            event,
                            "Please login to access this page."
                        );

                    }

                }
            );

        }
    );


    /* =====================================================
       CATEGORY CARDS
    ===================================================== */

    const categoryCards =
        document.querySelectorAll(
            ".category-card"
        );


    categoryCards.forEach(
        (card) => {

            card.addEventListener(
                "click",
                (event) => {

                    if (!checkLogin()) {

                        requireLogin(
                            event,
                            "Please login to view our collections."
                        );

                    }

                }
            );

        }
    );


    /* =====================================================
       HERO BUTTONS
    ===================================================== */

    const heroButtons =
        document.querySelectorAll(
            ".hero a, .luxury-banner a, .featured-products a"
        );


    heroButtons.forEach(
        (button) => {

            const href =
                button.getAttribute(
                    "href"
                );


            if (
                href &&
                (
                    href.includes("shop.html") ||
                    href.includes("collections.html")
                )
            ) {

                button.addEventListener(
                    "click",
                    (event) => {

                        if (!checkLogin()) {

                            requireLogin(
                                event,
                                "Please login to continue."
                            );

                        }

                    }
                );

            }

        }
    );


    /* =====================================================
       FOOTER PROTECTED LINKS
    ===================================================== */

    const footerLinks =
        document.querySelectorAll(
            ".footer a"
        );


    footerLinks.forEach(
        (link) => {

            const href =
                link.getAttribute(
                    "href"
                );


            if (
                href &&
                (
                    href.includes("shop.html") ||
                    href.includes("collections.html") ||
                    href.includes("about.html") ||
                    href.includes("contact.html") ||
                    href.includes("faq.html") ||
                    href.includes("shipping-returns.html") ||
                    href.includes("cart.html") ||
                    href.includes("account.html")
                )
            ) {

                link.addEventListener(
                    "click",
                    (event) => {

                        if (!checkLogin()) {

                            requireLogin(
                                event,
                                "Please login to access this page."
                            );

                        }

                    }
                );

            }

        }
    );


    /* =====================================================
       IMAGE FALLBACK
    ===================================================== */

    document
        .querySelectorAll(
            "img"
        )
        .forEach(
            (image) => {

                image.addEventListener(
                    "error",
                    () => {

                        image.style.display =
                            "none";

                    }
                );

            }
        );


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".section-header, " +
            ".product-card, " +
            ".category-card, " +
            ".about-content, " +
            ".newsletter-content"
        );


    if (
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "visible"
                                );


                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.1
                }
            );


        revealElements.forEach(
            (element) => {

                element.classList.add(
                    "reveal"
                );


                observer.observe(
                    element
                );

            }
        );

    }


    /* =====================================================
       STORAGE EVENT
    ===================================================== */

    window.addEventListener(
        "storage",
        (event) => {

            const currentCartKey =
                getCartStorageKey();


            if (
                currentCartKey &&
                event.key === currentCartKey
            ) {

                updateCartCount();

            }


            if (
                event.key ===
                "luxuryJewelryFavorites"
            ) {

                updateFavoriteButtons();

            }

        }
    );


    /* =====================================================
       CART UPDATED EVENT
    ===================================================== */

    window.addEventListener(
        "cartUpdated",
        () => {

            updateCartCount();

        }
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    updateCartCount();

    updateFavoriteButtons();


    console.log(
        checkLogin()
            ? "Luxury Jewelry: User is logged in."
            : "Luxury Jewelry: User is logged out."
    );

});