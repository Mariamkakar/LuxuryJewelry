/* =====================================================
   LUXURY JEWELRY
   SHOP PAGE JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================================================
       ELEMENTS
       Get the HTML element where all products will be displayed
    ========================================================= */

    const productsGrid =
        document.getElementById("productsGrid");

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    const sortProducts =
        document.getElementById("sortProducts");


    /* =================================================================================
       CART
       This function gets the logged-in users information from localStorage, converts 
       the JSON data into a JavaScript object, and returns null if the data is invalid.

    =============================================================================*/

    function getShopLoggedInUser() {

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


    /* =====================================================
       Get a unique key for the currently logged-in user
    ===================================================== */

    function getShopUserKey() {

        const user =
            getShopLoggedInUser();

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


    /* ==============================================================
       Create a unique localStorage key for the current user's cart
    ========================================================== */

    function getShopCartStorageKey() {

        const userKey =
            getShopUserKey();

        if (!userKey) {
            return null;
        }

        return `luxuryJewelryCart_${userKey}`;

    }


    /* =====================================================
       GET USER CART
       Get the current user's cart from localStorage
    ===================================================== */

    function getShopUserCart() {

        const storageKey =
            getShopCartStorageKey();

        if (!storageKey) {
            return [];
        }

        try {

            const savedCart =
                localStorage.getItem(
                    storageKey
                );

            if (!savedCart) {
                return [];
            }

            const parsedCart =
                JSON.parse(savedCart);

            return Array.isArray(parsedCart)
                ? parsedCart
                : [];

        } catch (error) {

            console.error(
                "Invalid user cart data."
            );

            return [];

        }

    }


    /* =====================================================
       Save the current user's cart to localStorage
    ===================================================== */

    function saveShopUserCart(cartData) {

        const storageKey =
            getShopCartStorageKey();

        if (!storageKey) {
            return;
        }

        localStorage.setItem(
            storageKey,
            JSON.stringify(cartData)
        );

    }


    /* =====================================================
       Get the current user's cart
    ===================================================== */

    let cart =
        getShopUserCart();


    /* =====================================================
       FAVORITES
       Get the user's favorite products from localStorage
    ===================================================== */

    let favorites = [];

    try {

        favorites =
            JSON.parse(
                localStorage.getItem(
                    "luxuryJewelryFavorites"
                )
            ) || [];

    } catch (error) {

        favorites = [];

    }


    /* =====================================================
       PRODUCT CARDS
       Get all product cards from the page
    ===================================================== */

    let productCards =
        Array.from(
            document.querySelectorAll(
                ".product-card"
            )
        );


    /* =====================================================================
       URL PARAMETERS
       This part gets the collection and search information from the URL.
    ================================================================= */

    const urlParams =
        new URLSearchParams(
            window.location.search
        );


    const collection =
        (
            urlParams.get("collection") || ""
        )
        .trim()
        .toLowerCase();


    const searchQuery =
        (
            urlParams.get("search") || ""
        )
        .trim()
        .toLowerCase();


    /* =====================================================
       It cleans and prepares the text for searching.
    ===================================================== */

    function normalizeSearchText(text) {

        return String(text || "")
            .toLowerCase()
            .trim()
            .replace(
                /[^\w\s-]/g,
                " "
            )
            .replace(
                /\s+/g,
                " "
            );

    }


    /* ========================================================================================
       This function gets the product name, price, image, and category from the product card.
    ================================================================================== */

    function getProductData(card) {

        if (!card) {
            return null;
        }


        const imageElement =
            card.querySelector("img");


        const name =
            card.dataset.name ||
            card.querySelector(
                ".product-name, h3, h2"
            )?.textContent.trim() ||
            "Jewelry";


        const price =
            Number(
                card.dataset.price
            ) ||
            Number(
                (
                    card.querySelector(
                        ".product-price"
                    )?.textContent || ""
                )
                .replace(
                    /[^0-9.]/g,
                    ""
                )
            ) ||
            0;


        const image =
            card.dataset.image ||
            imageElement?.getAttribute("src") ||
            "";


        const category =
            card.dataset.category ||
            card.dataset.type ||
            card.dataset.collection ||
            getProductCategory(name);


        return {

            name: name,

            price: price,

            image: image,

            category: category

        };

    }


    /* =====================================================
       This function identifies the product category based on the product name.

    ===================================================== */

    function getProductCategory(name) {

        const text =
            normalizeSearchText(name);


        if (text.includes("ring")) {
            return "Rings";
        }


        if (text.includes("necklace")) {
            return "Necklaces";
        }


        if (text.includes("earring")) {
            return "Earrings";
        }


        if (text.includes("bracelet")) {
            return "Bracelets";
        }


        if (
            text.includes("jewelry set") ||
            text.includes("jewellery set") ||
            text.includes(" set")
        ) {
            return "Jewelry Sets";
        }


        return "Jewelry";

    }


    /* ===============================================================================================================
       This section checks that Favorites is an array and then checks each favorite to convert it to the new format.
    ===================================================== ===================================================*/

    function migrateOldFavorites() {

        if (!Array.isArray(favorites)) {
            favorites = [];
        }


        let changed = false;


        favorites =
            favorites
                .map((favorite) => {

                    /* ==========================================================================================================
                       This part checks the existing favorite object and returns its product information in the correct format.
                    =====================================================================================================*/

                    if (
                        favorite &&
                        typeof favorite === "object"
                    ) {

                        return {

                            name:
                                favorite.name ||
                                "Jewelry",

                            price:
                                Number(
                                    favorite.price
                                ) || 0,

                            image:
                                favorite.image ||
                                "",

                            category:
                                favorite.category ||
                                getProductCategory(
                                    favorite.name
                                )

                        };

                    }


                    /* ===============================================================================================================
                       This part finds the matching product card and converts the old favorite name into the new product format.
                    ========================================================================================================== */

                    if (
                        typeof favorite === "string"
                    ) {

                        const favoriteName =
                            favorite;


                        const matchingCard =
                            productCards.find(
                                (card) => {

                                    return (
                                        normalizeSearchText(
                                            card.dataset.name
                                        ) ===
                                        normalizeSearchText(
                                            favoriteName
                                        )
                                    );

                                }
                            );


                        if (matchingCard) {

                            changed = true;

                            return getProductData(
                                matchingCard
                            );

                        }


                        changed = true;

                        return {

                            name:
                                favoriteName,

                            price:
                                0,

                            image:
                                "",

                            category:
                                getProductCategory(
                                    favoriteName
                                )

                        };

                    }


                    return null;

                })
                .filter(Boolean);


        if (changed) {

            localStorage.setItem(
                "luxuryJewelryFavorites",
                JSON.stringify(
                    favorites
                )
            );

        }

    }


    /* =====================================================
       UPDATE CART COUNT
    ===================================================== */

    function updateCartCount() {

        const cartCounts =
            document.querySelectorAll(
                ".cart-count"
            );


        let totalItems = 0;


        cart.forEach((item) => {

            totalItems +=
                Number(item.quantity) || 1;

        });


        cartCounts.forEach((counter) => {

            counter.textContent =
                totalItems;

        });

    }


    /* ==========================================================
       Save the cart, update the cart count, and notify the page
    ===================================================== */

    function saveCart() {

        saveShopUserCart(cart);


        updateCartCount();


        window.dispatchEvent(
            new Event("cartUpdated")
        );

    }


    /* ==========================================================
       Check if the user is logged in before adding the product
    ========================================================== */

    function addToCart(button) {


        const user =
            getShopLoggedInUser();


        if (!user) {

            showNotification(
                "Please login before adding products to your cart."
            );


            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 1000);


            return;

        }


        /* ================================================
        Get the product name, price, image, and category
        ============================================ */

        const name =
            button.dataset.name ||
            "Jewelry";


        const price =
            Number(
                button.dataset.price
            ) || 0;


        const image =
            button.dataset.image ||
            "";


        const category =
            button.dataset.category ||
            button.dataset.type ||
            button.dataset.collection ||
            getProductCategory(name);


        /* ==================================================
           Check if the product already exists in the cart
        ============================================= */

        const existingProduct =
            cart.find(
                (item) => {

                    return (
                        normalizeSearchText(
                            item.name
                        ) ===
                        normalizeSearchText(
                            name
                        )
                    );

                }
            );


        /* ---------------------------------------------
           INCREASE QUANTITY
        --------------------------------------------- */

        if (existingProduct) {

            existingProduct.quantity =
                (
                    Number(
                        existingProduct.quantity
                    ) || 1
                ) + 1;

        }


        /* ---------------------------------------------
           ADD NEW PRODUCT
        --------------------------------------------- */

        else {

            cart.push({

                name:
                    name,

                price:
                    price,

                image:
                    image,

                category:
                    category,

                quantity:
                    1

            });

        }


        /* ---------------------------------------------
           SAVE this CART
        --------------------------------------------- */

        saveCart();


        /* ---------------------------------------------
           disply NOTIFICATION
        --------------------------------------------- */

        showNotification(
            `${name} added to cart.`
        );


        /* ---------------------------------------------
           BUTTON FEEDBACK
        --------------------------------------------- */

        const originalText =
            button.textContent;


        button.textContent =
            "ADDED ✓";


        button.classList.add(
            "added"
        );


        setTimeout(() => {

            button.textContent =
                originalText;

            button.classList.remove(
                "added"
            );

        }, 1500);

    }


    /* =====================================================================================================================
       NOTIFICATION
       This section adds the product to the cart or increases the quantity of an existing product, and then saves the cart.
    ================================================================================================================ */

    function showNotification(message) {

        const oldNotification =
            document.querySelector(
                ".shop-notification"
            );


        if (oldNotification) {
            oldNotification.remove();
        }


        const notification =
            document.createElement("div");


        notification.className =
            "shop-notification";


        notification.textContent =
            message;


        document.body.appendChild(
            notification
        );


        setTimeout(() => {

            notification.classList.add(
                "show"
            );

        }, 10);


        setTimeout(() => {

            notification.classList.remove(
                "show"
            );


            setTimeout(() => {

                if (notification) {
                    notification.remove();
                }

            }, 300);

        }, 2200);

    }


    /* =====================================================
       GET FAVORITE NAME
    ===================================================== */

    function getFavoriteName(favorite) {

        if (
            favorite &&
            typeof favorite === "object"
        ) {

            return favorite.name || "";

        }


        if (
            typeof favorite === "string"
        ) {

            return favorite;

        }


        return "";

    }


    /* ===================================================================================================
       UPDATE FAVORITE BUTTONS
       This function updates the favorite buttons based on whether the product is in the Favorites list.
    ========================================================================================= */

    function updateFavoriteButtons() {

        const favoriteButtons =
            document.querySelectorAll(
                ".wishlist-btn"
            );


        favoriteButtons.forEach((button) => {

            const productName =
                button.dataset.product;


            if (!productName) {
                return;
            }


            const isFavorite =
                favorites.some(
                    (favorite) => {

                        return (
                            normalizeSearchText(
                                getFavoriteName(
                                    favorite
                                )
                            ) ===
                            normalizeSearchText(
                                productName
                            )
                        );

                    }
                );


            if (isFavorite) {

                button.classList.add(
                    "active"
                );


                button.textContent =
                    "♥️";


                button.setAttribute(
                    "aria-label",
                    `Remove ${productName} from Favorites`
                );

            } else {

                button.classList.remove(
                    "active"
                );


                button.textContent =
                    "♡";


                button.setAttribute(
                    "aria-label",
                    `Add ${productName} to Favorites`
                );

            }

        });

    }


    /* ======================================================================
       This function updates the number of favorite products in the navbar.
    ================================================================= */

    function updateFavoriteCount() {

        const favoriteCounts =
            document.querySelectorAll(
                ".wishlist-count"
            );


        favoriteCounts.forEach((counter) => {

            counter.textContent =
                favorites.length;

        });

    }


    /* ====================================================================================================
       This function saves the Favorites list in localStorage and updates the Favorite buttons and count.
    ============================================================================================ */

    function saveFavorites() {

        localStorage.setItem(
            "luxuryJewelryFavorites",
            JSON.stringify(
                favorites
            )
        );


        updateFavoriteCount();

        updateFavoriteButtons();


        window.dispatchEvent(
            new Event(
                "favoritesUpdated"
            )
        );

    }


    /* =============================================================
       Add the product to Favorites or remove it if already added
    ===================================================== */

    function toggleFavorite(button) {

        const productName =
            button.dataset.product;


        if (!productName) {
            return;
        }


        /*Get the product information*/

        /* =======================
           FIND PRODUCT CARD
        ==================== */

        const productCard =
            productCards.find(
                (card) => {

                    return (
                        normalizeSearchText(
                            card.dataset.name
                        ) ===
                        normalizeSearchText(
                            productName
                        )
                    );

                }
            );


        /* ==========================================================
           GET FULL PRODUCT DATA
        ==================================================== */

        let productData =
            getProductData(
                productCard
            );


        /* ==========================================================
           Use button data if product information is not available
        ==================================================== */

        if (!productData) {

            productData = {

                name:
                    productName,

                price:
                    Number(
                        button.dataset.price
                    ) || 0,

                image:
                    button.dataset.image ||
                    "",

                category:
                    button.dataset.category ||
                    getProductCategory(
                        productName
                    )

            };

        }


        /* ==================================================
           Check if the product already exists in Favorites
        ==============================================*/

        const favoriteIndex =
            favorites.findIndex(
                (favorite) => {

                    return (
                        normalizeSearchText(
                            getFavoriteName(
                                favorite
                            )
                        ) ===
                        normalizeSearchText(
                            productName
                        )
                    );

                }
            );


        /*=====================================================
           Add the product to Favorites if it does not exist
        ============================================= */

        if (favoriteIndex === -1) {

            favorites.push({

                name:
                    productData.name,

                price:
                    Number(
                        productData.price
                    ) || 0,

                image:
                    productData.image || "",

                category:
                    productData.category ||
                    getProductCategory(
                        productData.name
                    )

            });

           /*Show a notification after adding the product*/

            showNotification(
                `${productName} added to Favorites.`
            );

        }

        else {

            favorites.splice(
                favoriteIndex,
                1
            );


            showNotification(
                `${productName} removed from Favorites.`
            );

        }


        saveFavorites();

    }


    /* =====================================================
       GET ACTIVE COLLECTION
    ===================================================== */

    function getActiveCollection() {

        const activeFilter =
            document.querySelector(
                ".filter-btn.active"
            );


        if (
            activeFilter &&
            activeFilter.dataset.filter
        ) {

            return (
                activeFilter.dataset.filter
            )
            .trim()
            .toLowerCase();

        }


        return "all";

    }


    /* =====================================================
       SEARCH VARIATIONS
    ===================================================== */

    function getSearchVariations(query) {

        const normalized =
            normalizeSearchText(
                query
            );


        const variations = [
            normalized
        ];


        if (
            normalized.endsWith("s") &&
            !normalized.endsWith("ss")
        ) {

            variations.push(
                normalized.slice(0, -1)
            );

        } else {

            variations.push(
                normalized + "s"
            );

        }


        const aliases = {

            "ring": [
                "rings"
            ],

            "rings": [
                "ring"
            ],

            "necklace": [
                "necklaces"
            ],

            "necklaces": [
                "necklace"
            ],

            "earring": [
                "earrings"
            ],

            "earrings": [
                "earring"
            ],

            "bracelet": [
                "bracelets"
            ],

            "bracelets": [
                "bracelet"
            ],

            "jewelry set": [
                "jewelry sets",
                "jewellery set",
                "jewellery sets",
                "set",
                "sets"
            ],

            "jewelry sets": [
                "jewelry set",
                "jewellery set",
                "jewellery sets",
                "set",
                "sets"
            ]

        };


        if (aliases[normalized]) {

            variations.push(
                ...aliases[normalized]
            );

        }


        return [
            ...new Set(
                variations
            )
        ];

    }


    /* =====================================================
       THIS SECTION IS MATCH SEARCH
    ===================================================== */

    function matchesSearch(
        card,
        query
    ) {

        if (!query) {
            return true;
        }


        const productName =
            normalizeSearchText(
                card.dataset.name
            );


        const productType =
            normalizeSearchText(
                card.dataset.type
            );


        const productCollection =
            normalizeSearchText(
                card.dataset.collection
            );


        const productCategory =
            normalizeSearchText(
                card.dataset.category
            );


        const productText =
            normalizeSearchText(
                card.textContent
            );


        const searchableText = [

            productName,

            productType,

            productCollection,

            productCategory,

            productText

        ].join(" ");


        const variations =
            getSearchVariations(
                query
            );


        return variations.some(
            (variation) =>
                searchableText.includes(
                    variation
                )
        );

    }


    /* =====================================================
       FILTER + SEARCH
    ===================================================== */

    function applyFilters() {

        const activeCollection =
            getActiveCollection();


        let visibleProducts = 0;


        productCards.forEach((card) => {

            const cardCollection =
                normalizeSearchText(
                    card.dataset.collection
                );


            let collectionMatches =
                activeCollection === "all";


            if (!collectionMatches) {

                collectionMatches =
                    cardCollection ===
                    activeCollection;

            }


            const searchMatches =
                matchesSearch(
                    card,
                    searchQuery
                );


            const shouldShow =
                collectionMatches &&
                searchMatches;


            if (shouldShow) {

                card.classList.remove(
                    "hidden"
                );

                visibleProducts++;

            } else {

                card.classList.add(
                    "hidden"
                );

            }

        });


        let customMessage = null;


        if (searchQuery) {

            customMessage =
                `No products found for "${searchQuery}".`;

        } else if (
            activeCollection !== "all"
        ) {

            customMessage =
                "There are no products in this collection yet.";

        }


        updateEmptyMessage(
            visibleProducts,
            customMessage
        );

    }


    /* =====================================================
       EMPTY MESSAGE
       Show a message when no products are found
    ===================================================== */

    function updateEmptyMessage(
        count,
        customMessage = null
    ) {

        const oldMessage =
            document.querySelector(
                ".no-products"
            );


        if (oldMessage) {
            oldMessage.remove();
        }


        if (
            count === 0 &&
            productsGrid
        ) {

            const message =
                document.createElement(
                    "div"
                );


            message.className =
                "no-products";


            message.innerHTML = `

                <h3>
                    No Products Found
                </h3>

                <p>
                    ${
                        customMessage ||
                        "There are no products in this collection yet."
                    }
                </p>

            `;


            productsGrid.appendChild(
                message
            );

        }

    }


    /* =====================================================
       SORT PRODUCTS
       Sort products by price or product name
    ===================================================== */

    function sortProductCards(sortType) {

        const cards =
            Array.from(
                document.querySelectorAll(
                    ".product-card"
                )
            );


        cards.sort((a, b) => {

            const priceA =
                Number(
                    a.dataset.price
                ) || 0;


            const priceB =
                Number(
                    b.dataset.price
                ) || 0;


            const nameA =
                normalizeSearchText(
                    a.dataset.name
                );


            const nameB =
                normalizeSearchText(
                    b.dataset.name
                );


            if (
                sortType === "low-high"
            ) {

                return priceA - priceB;

            }


            if (
                sortType === "high-low"
            ) {

                return priceB - priceA;

            }


            if (
                sortType === "name"
            ) {

                return nameA.localeCompare(
                    nameB
                );

            }


            return 0;

        });


        cards.forEach((card) => {

            productsGrid.appendChild(
                card
            );

        });


        productCards =
            Array.from(
                document.querySelectorAll(
                    ".product-card"
                )
            );


        applyFilters();

    }


    /* =====================================================
       FILTER BUTTON EVENTS
    ===================================================== */

    filterButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    (btn) => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                applyFilters();

            }
        );

    });


    /* =====================================================
       SORT EVENT
    ===================================================== */

    if (sortProducts) {

        sortProducts.addEventListener(
            "change",
            () => {

                sortProductCards(
                    sortProducts.value
                );

            }
        );

    }


    /* =====================================================
       ADD TO CART EVENTS
    ===================================================== */

    document
        .querySelectorAll(
            ".add-cart-btn"
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    event.stopPropagation();

                    addToCart(
                        button
                    );

                }
            );

        });


    /* =====================================================
       FAVORITE EVENTS
    ===================================================== */

    document
        .querySelectorAll(
            ".wishlist-btn"
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    event.stopPropagation();

                    toggleFavorite(
                        button
                    );

                }
            );

        });


    /* =================================================================
       PRODUCT CARD CLICK
       Open the product details page when a product card is clicked
    ======================================================== */

    document
        .querySelectorAll(
            ".product-card"
        )
        .forEach((card) => {

            card.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target.closest(
                            ".add-cart-btn"
                        ) ||
                        event.target.closest(
                            ".wishlist-btn"
                        )
                    ) {

                        return;

                    }


                    const productName =
                        card.dataset.name;


                    if (!productName) {
                        return;
                    }


                    const productSlug =
                        productName
                            .toLowerCase()
                            .trim()
                            .replace(
                                /\s+/g,
                                "-"
                            );


                    window.location.href =
                        `product-details.html?product=${productSlug}`;

                }
            );

        });


    /* ==================================================================
       COLLECTION FROM URL
       Get the collection from the URL and activate the matching filter
    ============================================================*/

    if (collection) {

        const matchingButton =
            document.querySelector(
                `.filter-btn[data-filter="${collection}"]`
            );


        if (matchingButton) {

            filterButtons.forEach(
                (button) => {

                    button.classList.remove(
                        "active"
                    );

                }
            );


            matchingButton.classList.add(
                "active"
            );

        }

    }


    /* ==============================================================
       SEARCH FROM NAVBAR
       Handle search from the navbar and activate the All filter
    ======================================================== */

    if (searchQuery && !collection) {

        filterButtons.forEach(
            (button) => {

                button.classList.remove(
                    "active"
                );

            }
        );


        const allButton =
            document.querySelector(
                '.filter-btn[data-filter="all"]'
            );


        if (allButton) {

            allButton.classList.add(
                "active"
            );

        }

    }


    /* =====================================================
       MIGRATE OLD FAVORITES
       Convert old favorite data to the new format
    ===================================================== */

    migrateOldFavorites();


    /* =====================================================
       INITIALIZE
       Initialize the cart, favorites, and product filters
    ===================================================== */

    updateCartCount();

    updateFavoriteButtons();

    updateFavoriteCount();

    applyFilters();


    /* =====================================================
       STORAGE EVENTS
    Update cart and favorites when localStorage changes
    ===================================================== */

    window.addEventListener(
        "storage",
        (event) => {

            /* -----------------------------------------
               FAVORITES
               Update favorites when favorite data changes
            ----------------------------------------- */

            if (
                event.key ===
                "luxuryJewelryFavorites"
            ) {

                try {

                    favorites =
                        JSON.parse(
                            event.newValue
                        ) || [];

                } catch (error) {

                    favorites = [];

                }


                updateFavoriteButtons();

                updateFavoriteCount();

            }


            /* =======================================================
               USER-SPECIFIC CART
               Update the current user's cart when storage changes
               =========================================== */

            const currentCartKey =
                getShopCartStorageKey();


            if (
                currentCartKey &&
                event.key === currentCartKey
            ) {

                try {

                    cart =
                        JSON.parse(
                            event.newValue
                        ) || [];

                } catch (error) {

                    cart = [];

                }


                updateCartCount();

            }


            /* -----------------------------------------
               LOGIN / LOGOUT
            ----------------------------------------- */

            if (
                event.key ===
                "luxuryJewelryLoggedInUser"
            ) {

                cart =
                    getShopUserCart();

                updateCartCount();

            }

        }
    );


    /* =====================================================
       FAVORITES SAME PAGE
    ===================================================== */

    window.addEventListener(
        "favoritesUpdated",
        () => {

            try {

                favorites =
                    JSON.parse(
                        localStorage.getItem(
                            "luxuryJewelryFavorites"
                        )
                    ) || [];

            } catch (error) {

                favorites = [];

            }


            updateFavoriteButtons();

            updateFavoriteCount();

        }
    );


    /* =====================================================
       CART SAME PAGE
    ===================================================== */

    window.addEventListener(
        "cartUpdated",
        () => {

            cart =
                getShopUserCart();

            updateCartCount();

        }
    );


    /* =====================================================
       PAGE VISIBILITY
       Refresh cart after returning to Shop
    ===================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.visibilityState ===
                "visible"
            ) {

                cart =
                    getShopUserCart();

                updateCartCount();

            }

        }
    );

});