/* =====================================================
   LUXURY JEWELRY
   SHOP PAGE JAVASCRIPT
   Product filters, sorting, cart, favorites and login
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =================================================
       1. DOM ELEMENTS
    ================================================= */

    const productsGrid = document.getElementById("productsGrid");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const sortProducts = document.getElementById("sortProducts");
    const productCards = document.querySelectorAll(".product-card");


    /* =================================================
       2. CURRENT USER
    ================================================= */

    function getCurrentUser() {
        try {
            const userData = localStorage.getItem(
                "luxuryJewelryLoggedInUser"
            );

            return userData ? JSON.parse(userData) : null;

        } catch (error) {
            console.error("Unable to read logged-in user:", error);
            return null;
        }
    }

    function getCurrentUserKey() {
        const user = getCurrentUser();

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

    function isUserLoggedIn() {
        return Boolean(getCurrentUser());
    }


    /* =================================================
       3. STORAGE KEYS
    ================================================= */

    function getCartStorageKey() {
        const userKey = getCurrentUserKey();

        return userKey
            ? `luxuryJewelryCart_${userKey}`
            : null;
    }

    function getFavoritesStorageKey() {
        const userKey = getCurrentUserKey();

        return userKey
            ? `luxuryJewelryFavorites_${userKey}`
            : null;
    }


    /* =================================================
       4. READ AND SAVE LOCAL STORAGE
    ================================================= */

    function readStorageArray(key) {
        if (!key) {
            return [];
        }

        try {
            const savedData = localStorage.getItem(key);

            if (!savedData) {
                return [];
            }

            const parsedData = JSON.parse(savedData);

            return Array.isArray(parsedData) ? parsedData : [];

        } catch (error) {
            console.error(`Unable to read ${key}:`, error);
            return [];

        }
        
    }

    function saveStorageArray(key, data) {
        if (!key) {
            return false;
        }

        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;

        } catch (error) {
            console.error(`Unable to save ${key}:`, error);
            return false;
        }
    }


    /* =================================================
       5. PRODUCT SLUG
    ================================================= */

    function createProductSlug(name) {
        return String(name || "")
            .trim()
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function normalizeProductSlug(name, card) {
        const explicitSlug =
            card.dataset.slug ||
            card.dataset.productSlug;

        if (explicitSlug) {
            return explicitSlug.trim().toLowerCase();
        }

        const slug = createProductSlug(name);

        const goldenAliases = {
            "golden-ring": "gold-ring",
            "golden-earring": "gold-earrings",
            "golden-earrings": "gold-earrings",
            "golden-necklace": "gold-necklace",
            "golden-bracelet": "gold-bracelet",
            "golden-pendant": "gold-pendant",
            "golden-set": "gold-set",
            "golden-jewelry-set": "gold-set",
            "golden-jewellery-set": "gold-set"
        };

        return goldenAliases[slug] || slug;
    }

    function getProductSlug(card, product) {
        return normalizeProductSlug(product.name, card);
    }


    /* =================================================
       6. GET PRODUCT DATA
    ================================================= */

    function getProductData(card) {
        const imageElement =
            card.querySelector(".product-image img") ||
            card.querySelector("img");

        const nameElement = card.querySelector(
            ".product-name, .product-title, h2, h3, h4"
        );

        const priceElement = card.querySelector(
            ".product-price, .price"
        );

        const name =
            card.dataset.name ||
            nameElement?.textContent.trim() ||
            "";

        const rawPrice =
            card.dataset.price ||
            priceElement?.textContent ||
            "0";

        const price = Number(
            String(rawPrice).replace(/[^0-9.]/g, "")
        );

        const image =
            card.dataset.image ||
            imageElement?.getAttribute("src") ||
            "";


        const category =
            card.dataset.category ||
            card.dataset.type ||
            card.dataset.collection ||
            "";

        const product = {
            name: name,
            price: Number.isFinite(price) ? price : 0,
            image: image,
            category: category,
            collection: card.dataset.collection || category,
            sku: card.dataset.sku || "",
            quantity: 1
        };

        product.slug = getProductSlug(card, product);
        product.id = product.slug;
        product.productSlug = product.slug;

        return product;
    }


    /* =================================================
       7. NOTIFICATION MESSAGE
    ================================================= */

    function showShopMessage(message, type = "success") {
        let messageBox = document.getElementById("shopMessage");

        if (!messageBox) {
            messageBox = document.createElement("div");
            messageBox.id = "shopMessage";

            Object.assign(messageBox.style, {
                position: "fixed",
                top: "90px",
                right: "20px",
                zIndex: "99999",
                maxWidth: "calc(100% - 40px)",
                padding: "14px 20px",
                borderRadius: "10px",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "500",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                opacity: "1",
                transition: "opacity 0.25s ease"
            });

            document.body.appendChild(messageBox);
        }

        messageBox.textContent = message;

        messageBox.style.background =
            type === "error" ? "#a66d13" : "#c99525";

        messageBox.style.opacity = "1";

        if (messageBox.hideTimer) {
            clearTimeout(messageBox.hideTimer);
        }

        messageBox.hideTimer = setTimeout(function () {
            messageBox.style.opacity = "0";
        }, 2800);
    }


    /* =================================================
       8. LOGIN CHECK
    ================================================= */

    function requireLogin() {
        if (isUserLoggedIn() && getCurrentUserKey()) {
            return true;
        }

        showShopMessage(
            "Please login first to use your cart and favorites.",
            "error"
        );

        setTimeout(function () {
            if (!isUserLoggedIn()) {
                window.location.href = "login.html";
            }
        }, 1200);

        return false;
    }


    /* =================================================
       9. PRODUCT BUTTON STATES
       Before login: visually disabled.
       After login: buttons become active.
    ================================================= */

    function updateProductButtons() {
        const loggedIn =
            isUserLoggedIn() && Boolean(getCurrentUserKey());

        productCards.forEach(function (card) {
            const buttons = card.querySelectorAll(
                ".add-cart-btn, .wishlist-btn"
            );

            buttons.forEach(function (button) {

                // Keep click events available so guests see
                // the login message when they click a button.
                button.disabled = false;

                button.setAttribute(
                    "aria-disabled",
                    String(!loggedIn)
                );

                if (!loggedIn) {
                    button.style.opacity = "0.55";
                    button.style.cursor = "not-allowed";
                    button.title = "Please login to use this feature";
                } else {
                    button.style.opacity = "";
                    button.style.cursor = "";
                    button.removeAttribute("title");
                }
            });
        });
    }

    // Set the initial button states.
    updateProductButtons();


    /* =================================================
       10. UPDATE NAVBAR
    ================================================= */

    function updateNavbar(eventName) {
        window.dispatchEvent(new CustomEvent(eventName));
    }


    /* =================================================
       11. ADD PRODUCT TO CART
    ================================================= */

    function addToCart(product, quantity = 1) {
        if (!requireLogin()) {
            return;
        }

        const cartKey = getCartStorageKey();

        if (!cartKey) {
            showShopMessage(
                "Please login again to continue.",
                "error"
            );
            return;
        }

        const cart = readStorageArray(cartKey);

        const existingItem = cart.find(function (item) {
            const itemSlug =
                item.slug ||
                item.productSlug ||
                item.id;

            return itemSlug === product.slug;
        });

        if (existingItem) {
            existingItem.quantity =
                (parseInt(existingItem.quantity, 10) || 0) +
                quantity;

        } else {
            cart.push({
                id: product.slug,
                slug: product.slug,
                productSlug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                collection: product.collection,
                sku: product.sku,
                quantity: quantity
            });
        }

        if (!saveStorageArray(cartKey, cart)) {
            showShopMessage(
                "Unable to save your cart. Please try again.",
                "error"
            );
            return;
        }

        updateNavbar("cartUpdated");

        showShopMessage(
            `${product.name} added to your cart.`
        );
    }


    /* =================================================
       12. ADD PRODUCT TO FAVORITES
    ================================================= */

    function addToFavorites(product) {
        if (!requireLogin()) {
            return;
        }

        const favoritesKey = getFavoritesStorageKey();

        if (!favoritesKey) {
            showShopMessage(
                "Please login again to continue.",
                "error"
            );
            return;
        }

        const favorites = readStorageArray(favoritesKey);

        const alreadyExists = favorites.some(function (item) {
            if (typeof item === "string") {
                return item === product.slug;
            }

            const itemSlug =
                item.slug ||
                item.productSlug ||
                item.id;

            return itemSlug === product.slug;
        });

        if (alreadyExists) {
            showShopMessage(
                "This product is already in your favorites.",
                "error"
            );
            return;
        }

        favorites.push({
            id: product.slug,
            slug: product.slug,
            productSlug: product.slug,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            collection: product.collection,
            sku: product.sku
        });

        if (!saveStorageArray(favoritesKey, favorites)) {
            showShopMessage(
                "Unable to save favorites. Please try again.",
                "error"
            );
            return;
        }

        updateNavbar("favoritesUpdated");

        showShopMessage(
            `${product.name} added to your favorites.`
        );
    }


    /* =================================================
       13. OPEN PRODUCT DETAILS
    ================================================= */

    function openProductDetails(product) {
        if (!product || !product.slug) {
            showShopMessage(
                "Unable to open this product.",
                "error"
            );
            return;
        }

        window.location.href =
            "product-details.html?product=" +
            encodeURIComponent(product.slug);
    }


    /* =================================================
       14. PRODUCT CARD BUTTONS AND LINKS
    ================================================= */

    productCards.forEach(function (card) {
        const product = getProductData(card);

        const addCartButton =
            card.querySelector(".add-cart-btn");

        const wishlistButton =
            card.querySelector(".wishlist-btn");


        /* ---------------------------------------------
           ADD TO CART
        --------------------------------------------- */

        if (addCartButton) {
            addCartButton.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    if (!requireLogin()) {
                        return;
                    }

                    addToCart(product, 1);
                }
            );
        }


        /* ---------------------------------------------
           ADD TO FAVORITES
        --------------------------------------------- */

        if (wishlistButton) {
            wishlistButton.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    if (!requireLogin()) {
                        return;
                    }

                    addToFavorites(product);
                }
            );
        }


        /* ---------------------------------------------
           OPEN PRODUCT DETAILS FROM LINKS
        --------------------------------------------- */

        const productLinks = card.querySelectorAll(
            "a.product-link, .product-image a, .product-name a"
        );

        productLinks.forEach(function (link) {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                openProductDetails(product);
            });
        });


        /* ---------------------------------------------
           CLICK PRODUCT CARD
        --------------------------------------------- */

        card.addEventListener("click", function (event) {
            if (
                event.target.closest(
                    "button, a, input, select"
                )
            ) {
                return;
            }

            openProductDetails(product);
        });
    });


    /* =================================================
       15. FILTER PRODUCTS
    ================================================= */

    function filterProducts(category) {
        const selectedCategory =
            String(category).trim().toLowerCase();

        productCards.forEach(function (card) {
            const product = getProductData(card);

            const cardCategory =
                String(product.category).trim().toLowerCase();

            const cardCollection =
                String(product.collection).trim().toLowerCase();

            const matches =
                selectedCategory === "all" ||
                selectedCategory === "all products" ||
                cardCategory === selectedCategory ||
                cardCollection === selectedCategory;

            card.style.display = matches ? "" : "none";
        });
    }

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            filterButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            const category =
                button.dataset.filter ||
                button.dataset.category ||
                button.textContent.trim();

            filterProducts(category);
        });
    });


    /* =================================================
       16. SORT PRODUCTS
    ================================================= */

    function sortProductCards(sortValue) {
        if (!productsGrid) {
            return;
        }

        const cards = Array.from(
            productsGrid.querySelectorAll(".product-card")
        );

        cards.sort(function (cardA, cardB) {
            const productA = getProductData(cardA);
            const productB = getProductData(cardB);

            switch (sortValue) {
                case "low-high":
                    return productA.price - productB.price;

                case "high-low":
                    return productB.price - productA.price;

                case "name":
                    return productA.name.localeCompare(
                        productB.name
                    );

                default:
                    return 0;
            }
        });

        cards.forEach(function (card) {
            productsGrid.appendChild(card);
        });
    }

    if (sortProducts) {
        sortProducts.addEventListener("change", function () {
            sortProductCards(sortProducts.value);
        });
    }


    /* =================================================
       17. SEARCH FROM URL
       Example: shop.html?search=diamond
    ================================================= */

    const urlParameters = new URLSearchParams(
        window.location.search
    );

    const searchTerm = urlParameters.get("search");

    const collectionParameter =
        urlParameters.get("collection");

    function searchProducts(term) {
        const normalizedTerm =
            String(term || "").trim().toLowerCase();

        productCards.forEach(function (card) {
            const product = getProductData(card);

            const searchableText = [
                product.name,
                product.category,
                product.collection,
                product.sku
            ].join(" ").toLowerCase();

            const matches =
                !normalizedTerm ||
                searchableText.includes(normalizedTerm);

            card.style.display = matches ? "" : "none";
        });
    }

    if (searchTerm) {
        searchProducts(searchTerm);
    }


    /* =================================================
       18. COLLECTION FROM URL
       Example: shop.html?collection=golden
    ================================================= */

    if (collectionParameter) {
        filterProducts(collectionParameter);

        filterButtons.forEach(function (button) {
            const buttonCategory =
                button.dataset.filter ||
                button.dataset.category ||
                button.textContent.trim();

            if (
                buttonCategory.trim().toLowerCase() ===
                collectionParameter.trim().toLowerCase()
            ) {
                filterButtons.forEach(function (item) {
                    item.classList.remove("active");
                });

                button.classList.add("active");
            }
        });
    }


    /* =================================================
       19. HANDLE LOGIN AND STORAGE CHANGES
    ================================================= */

    window.addEventListener("storage", function (event) {
        if (
            event.key === "luxuryJewelryLoggedInUser" ||
            event.key === getCartStorageKey() ||
            event.key === getFavoritesStorageKey()
        ) {
            updateProductButtons();
            updateNavbar("cartUpdated");
            updateNavbar("favoritesUpdated");
        }
    });


    /* =================================================
       20. UPDATE WHEN PAGE BECOMES VISIBLE
    ================================================= */

    document.addEventListener(
        "visibilitychange",
        function () {
            if (!document.hidden) {
                updateProductButtons();
                updateNavbar("cartUpdated");
                updateNavbar("favoritesUpdated");
            }
        }
    );

    window.addEventListener("pageshow", function () {
        updateProductButtons();
    });

    window.addEventListener("focus", function () {
        updateProductButtons();
    });

    // Allow the login script to notify this page after login.
    window.addEventListener("luxuryJewelryAuthChanged", function () {
        updateProductButtons();
    });


    /* =================================================
       21. INITIAL FILTER FROM URL
    ================================================= */

    if (!searchTerm && !collectionParameter) {
        const activeFilter =
            document.querySelector(".filter-btn.active");

        if (activeFilter) {
            const category =
                activeFilter.dataset.filter ||
                activeFilter.dataset.category ||
                activeFilter.textContent.trim();

            filterProducts(category);
        }
    }


    /* =================================================
       22. INITIALIZE COMPLETE
    ================================================= */

    updateProductButtons();

    console.log(
        "Luxury Jewelry shop initialized successfully."
    );

});