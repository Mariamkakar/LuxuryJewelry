/* =====================================================
   LUXURY JEWELRY
   PRODUCT DETAILS PAGE JAVASCRIPT
===================================================== */


/* =====================================================
   PRODUCT DATABASE
===================================================== */

const products = {

    /* ---------------- DIAMOND COLLECTION ---------------- */

    "diamond-ring": {
        name: "Diamond Ring",
        price: 299.99,
        image: "images/diamond-ring.jpg",
        collection: "Diamond Collection",
        category: "Rings",
        sku: "DIA-R001",
        description: "A timeless diamond ring designed to add elegance and sparkle to every special moment."
    },

    "diamond-necklace": {
        name: "Diamond Necklace",
        price: 450,
        image: "images/diamond-necklace.jpg",
        collection: "Diamond Collection",
        category: "Necklaces",
        sku: "DIA-N001",
        description: "An elegant diamond necklace featuring a refined design for luxurious everyday and special-occasion styling."
    },

    "diamond-earrings": {
        name: "Diamond Earrings",
        price: 220,
        image: "images/diamond-earrings.jpg",
        collection: "Diamond Collection",
        category: "Earrings",
        sku: "DIA-E001",
        description: "Beautiful diamond earrings that bring a sophisticated sparkle to your look."
    },

    "diamond-bracelet": {
        name: "Diamond Bracelet",
        price: 380,
        image: "images/diamond-bracelet.jpg",
        collection: "Diamond Collection",
        category: "Bracelets",
        sku: "DIA-B001",
        description: "A delicate diamond bracelet created for a graceful and timeless appearance."
    },

    "diamond-pendant": {
        name: "Diamond Pendant",
        price: 199.99,
        image: "images/diamond-pendant.jpg",
        collection: "Diamond Collection",
        category: "Necklaces",
        sku: "DIA-P001",
        description: "A charming diamond pendant that adds a subtle touch of luxury to any outfit."
    },

    "diamond-set": {
        name: "Diamond Jewelry Set",
        price: 699.99,
        image: "images/diamond-set.jpg",
        collection: "Diamond Collection",
        category: "Jewelry Sets",
        sku: "DIA-S001",
        description: "A coordinated diamond jewelry set designed to create an elegant and memorable look."
    },


    /* ---------------- PEARL COLLECTION ---------------- */

    "pearl-necklace": {
        name: "Pearl Necklace",
        price: 250,
        image: "images/pearl-necklace.jpg",
        collection: "Pearl Collection",
        category: "Necklaces",
        sku: "PEA-N001",
        description: "A classic pearl necklace that combines graceful beauty with timeless elegance."
    },

    "pearl-earrings": {
        name: "Pearl Earrings",
        price: 180,
        image: "images/pearl-earrings.jpg",
        collection: "Pearl Collection",
        category: "Earrings",
        sku: "PEA-E001",
        description: "Elegant pearl earrings that bring a soft, sophisticated finish to your style."
    },

    "pearl-bracelet": {
        name: "Pearl Bracelet",
        price: 160,
        image: "images/pearl-bracelet.jpg",
        collection: "Pearl Collection",
        category: "Bracelets",
        sku: "PEA-B001",
        description: "A beautiful pearl bracelet designed for refined and effortless elegance."
    },

    "pearl-pendant": {
        name: "Pearl Pendant",
        price: 145,
        image: "images/pearl-pendant.jpg",
        collection: "Pearl Collection",
        category: "Necklaces",
        sku: "PEA-P001",
        description: "A delicate pearl pendant that adds a graceful accent to your jewelry collection."
    },

    "pearl-ring": {
        name: "Pearl Ring",
        price: 195,
        image: "images/pearl-ring.jpg",
        collection: "Pearl Collection",
        category: "Rings",
        sku: "PEA-R001",
        description: "A stylish pearl ring combining classic beauty with a modern jewelry design."
    },

    "pearl-set": {
        name: "Pearl Jewelry Set",
        price: 420,
        image: "images/pearl-set.jpg",
        collection: "Pearl Collection",
        category: "Jewelry Sets",
        sku: "PEA-S001",
        description: "A coordinated pearl jewelry set for elegant celebrations and thoughtful gifts."
    },


    /* ---------------- GOLDEN COLLECTION ---------------- */

"gold-ring": {
    name: "Golden Ring",
    price: 280,
    image: "images/golden-ring.jpg",
    collection: "Golden Collection",
    category: "Rings",
    sku: "GOL-R001",
    description: "A beautiful golden ring with a timeless finish suitable for everyday wear and special occasions."
},

"gold-necklace": {
    name: "Golden Necklace",
    price: 450,
    image: "images/golden-necklace.jpg",
    collection: "Golden Collection",
    category: "Necklaces",
    sku: "GOL-N001",
    description: "A luxurious golden necklace designed to bring warmth and sophistication to your appearance."
},

"gold-earrings": {
    name: "Golden Earrings",
    price: 175,
    image: "images/golden-earrings.jpg",
    collection: "Golden Collection",
    category: "Earrings",
    sku: "GOL-E001",
    description: "Elegant golden earrings that complement both classic and contemporary styles."
},

"gold-bracelet": {
    name: "Golden Bracelet",
    price: 350,
    image: "images/golden-bracelet.jpg",
    collection: "Golden Collection",
    category: "Bracelets",
    sku: "GOL-B001",
    description: "A refined golden bracelet designed to make every detail of your look feel special."
},

"gold-pendant": {
    name: "Golden Pendant",
    price: 190,
    image: "images/golden-pendant.jpg",
    collection: "Golden Collection",
    category: "Necklaces",
    sku: "GOL-P001",
    description: "A stylish golden pendant that adds a luxurious touch to your favorite necklace."
},

"gold-set": {
    name: "Golden Jewelry Set",
    price: 580,
    image: "images/golden-set.jpg",
    collection: "Golden Collection",
    category: "Jewelry Sets",
    sku: "GOL-S001",
    description: "A matching golden jewelry set created for a coordinated and elegant appearance."
},


    /* ---------------- EMERALD COLLECTION ---------------- */

    "emerald-ring": {
        name: "Emerald Ring",
        price: 320,
        image: "images/emerald-ring.jpg",
        collection: "Emerald Collection",
        category: "Rings",
        sku: "EME-R001",
        description: "A striking emerald ring that combines rich green color with sophisticated design."
    },

    "emerald-necklace": {
        name: "Emerald Necklace",
        price: 480,
        image: "images/emerald-necklace.jpg",
        collection: "Emerald Collection",
        category: "Necklaces",
        sku: "EME-N001",
        description: "An elegant emerald necklace designed to add a distinctive and luxurious accent."
    },

    "emerald-earrings": {
        name: "Emerald Earrings",
        price: 240,
        image: "images/emerald-earrings.jpg",
        collection: "Emerald Collection",
        category: "Earrings",
        sku: "EME-E001",
        description: "Beautiful emerald earrings that bring rich color and a graceful finish to your look."
    },

    "emerald-bracelet": {
        name: "Emerald Bracelet",
        price: 360,
        image: "images/emerald-bracelet.jpg",
        collection: "Emerald Collection",
        category: "Bracelets",
        sku: "EME-B001",
        description: "A refined emerald bracelet designed for customers who love distinctive gemstone jewelry."
    },

    "emerald-pendant": {
        name: "Emerald Pendant",
        price: 210,
        image: "images/emerald-pendant.jpg",
        collection: "Emerald Collection",
        category: "Necklaces",
        sku: "EME-P001",
        description: "A delicate emerald pendant that adds a vibrant gemstone accent to your outfit."
    },

    "emerald-set": {
        name: "Emerald Jewelry Set",
        price: 620,
        image: "images/emerald-set.jpg",
        collection: "Emerald Collection",
        category: "Jewelry Sets",
        sku: "EME-S001",
        description: "A coordinated emerald jewelry set designed for a polished and sophisticated appearance."
    },


    /* ---------------- RUBY COLLECTION ---------------- */

    "ruby-ring": {
        name: "Ruby Ring",
        price: 330,
        image: "images/ruby-ring.jpg",
        collection: "Ruby Collection",
        category: "Rings",
        sku: "RUB-R001",
        description: "A captivating ruby ring with a rich red gemstone and an elegant finish."
    },

    "ruby-necklace": {
        name: "Ruby Necklace",
        price: 490,
        image: "images/ruby-necklace.jpg",
        collection: "Ruby Collection",
        category: "Necklaces",
        sku: "RUB-N001",
        description: "A luxurious ruby necklace that adds color and sophistication to your jewelry collection."
    },

    "ruby-earrings": {
        name: "Ruby Earrings",
        price: 245,
        image: "images/ruby-earrings.jpg",
        collection: "Ruby Collection",
        category: "Earrings",
        sku: "RUB-E001",
        description: "Elegant ruby earrings designed to create a striking and graceful appearance."
    },

    "ruby-bracelet": {
        name: "Ruby Bracelet",
        price: 370,
        image: "images/ruby-bracelet.jpg",
        collection: "Ruby Collection",
        category: "Bracelets",
        sku: "RUB-B001",
        description: "A sophisticated ruby bracelet that brings a luxurious pop of color to your style."
    },

    "ruby-pendant": {
        name: "Ruby Pendant",
        price: 215,
        image: "images/ruby-pendant.jpg",
        collection: "Ruby Collection",
        category: "Necklaces",
        sku: "RUB-P001",
        description: "A beautiful ruby pendant designed to make a subtle yet memorable statement."
    },

    "ruby-set": {
        name: "Ruby Jewelry Set",
        price: 640,
        image: "images/ruby-set.jpg",
        collection: "Ruby Collection",
        category: "Jewelry Sets",
        sku: "RUB-S001",
        description: "A matching ruby jewelry set that combines rich color with timeless luxury."
    }
};


/* =====================================================
   PRODUCT URL ALIASES
===================================================== */

const productAliases = {

    // Golden products
    "golden-ring": "gold-ring",
    "gold-ring": "gold-ring",

    "golden-earring": "gold-earrings",
    "golden-earrings": "gold-earrings",
    "gold-earring": "gold-earrings",
    "gold-earrings": "gold-earrings",

    "golden-necklace": "gold-necklace",
    "gold-necklace": "gold-necklace",

    "golden-bracelet": "gold-bracelet",
    "gold-bracelet": "gold-bracelet",

    "golden-pendant": "gold-pendant",
    "gold-pendant": "gold-pendant",

    "golden-set": "gold-set",
    "gold-set": "gold-set",
    "golden-jewelry-set": "gold-set",
    "golden-jewellery-set": "gold-set",
    "gold-jewelry-set": "gold-set",
    "gold-jewellery-set": "gold-set",

    // Diamond products
    "diamond-jewelry-set": "diamond-set",
    "diamond-jewellery-set": "diamond-set",

    // Pearl products
    "pearl-jewelry-set": "pearl-set",
    "pearl-jewellery-set": "pearl-set",

    // Emerald products
    "emerald-jewelry-set": "emerald-set",
    "emerald-jewellery-set": "emerald-set",

    // Ruby products
    "ruby-jewelry-set": "ruby-set",
    "ruby-jewellery-set": "ruby-set"
};


/* =====================================================
   STORAGE HELPERS
===================================================== */

function getCurrentUser() {
    try {
        const userData = localStorage.getItem(
            "luxuryJewelryLoggedInUser"
        );

        return userData ? JSON.parse(userData) : null;

    } catch (error) {
        console.error(
            "Unable to read logged-in user:",
            error
        );

        return null;
    }
}


function getCurrentUserKey() {
    const user = getCurrentUser();

    if (!user) {
        return null;
    }

    const identifier =
        user.id ||
        user.userId ||
        user.email;

    if (!identifier) {
        return null;
    }

    return String(identifier)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "_");
}


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

        return Array.isArray(parsedData)
            ? parsedData
            : [];

    } catch (error) {
        console.error(
            `Unable to read ${key}:`,
            error
        );

        return [];
    }
}


function saveStorageArray(key, data) {
    if (!key) {
        return false;
    }

    try {
        localStorage.setItem(
            key,
            JSON.stringify(data)
        );

        return true;

    } catch (error) {
        console.error(
            `Unable to save ${key}:`,
            error
        );

        return false;
    }
}


/* =====================================================
   NOTIFICATIONS
===================================================== */

function showProductMessage(
    message,
    type = "success"
) {
    let messageBox =
        document.getElementById("productMessage");

    if (!messageBox) {
        messageBox = document.createElement("div");

        messageBox.id = "productMessage";

        Object.assign(messageBox.style, {
            position: "fixed",
            top: "90px",
            right: "20px",
            zIndex: "99999",
            padding: "14px 20px",
            borderRadius: "10px",
            maxWidth: "calc(100% - 40px)",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            transition: "opacity 0.25s ease",
            opacity: "1"
        });

        document.body.appendChild(messageBox);
    }

    messageBox.textContent = message;

    messageBox.style.background =
        type === "error"
            ? "#dab57b"
            : "#edc43f";

    messageBox.style.color = "#ffffff";
    messageBox.style.opacity = "1";

    if (messageBox.hideTimer) {
        clearTimeout(messageBox.hideTimer);
    }

    messageBox.hideTimer = setTimeout(() => {
        messageBox.style.opacity = "0";
    }, 2800);
}


function requireProductLogin() {
    if (getCurrentUser()) {
        return true;
    }

    showProductMessage(
        "Please login to use your shopping cart and favorites.",
        "error"
    );

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1200);

    return false;
}


function notifyNavbarUpdate(eventName) {
    window.dispatchEvent(
        new CustomEvent(eventName)
    );
}


/* =====================================================
   GET PRODUCT SLUG FROM URL
===================================================== */

function getRequestedProductSlug() {
    const urlParameters = new URLSearchParams(
        window.location.search
    );

    const requestedSlug =
        urlParameters.get("product") || "";

    const normalizedSlug = requestedSlug
        .trim()
        .toLowerCase()
        .replace(/\.html$/, "")
        .replace(/[\s_]+/g, "-");

    return productAliases[normalizedSlug]
        || normalizedSlug;
}


/* =====================================================
   LOAD PRODUCT IMAGE
===================================================== */

function loadProductImage(imageElement, product) {
    if (!imageElement || !product) {
        return;
    }

    const originalPath = product.image;

    /*
       Keep the project's existing image path first.
       Then try alternate relative paths.
    */

    const imagePaths = [
        originalPath,
        `./${originalPath}`,
        `../${originalPath}`
    ];

    const uniqueImagePaths = [
        ...new Set(imagePaths)
    ];

    let currentPathIndex = 0;

    imageElement.alt = product.name;
    imageElement.style.display = "";
    imageElement.removeAttribute("src");

    imageElement.onerror = function () {
        currentPathIndex++;

        if (
            currentPathIndex <
            uniqueImagePaths.length
        ) {
            this.src =
                uniqueImagePaths[currentPathIndex];

            return;
        }

        this.onerror = null;

        console.error(
            "Unable to load product image.",
            {
                productName: product.name,
                originalPath: originalPath,
                attemptedPaths: uniqueImagePaths
            }
        );

        this.alt =
            `${product.name} image could not be loaded`;
    };

    imageElement.src = uniqueImagePaths[0];
}


/* =====================================================
   INITIALIZE PRODUCT DETAILS
===================================================== */

function initializeProductDetails() {

    const productImage =
        document.getElementById("productImage");

    const productCategory =
        document.getElementById("productCategory");

    const productName =
        document.getElementById("productName");

    const productPrice =
        document.getElementById("productPrice");

    const productReviews =
        document.getElementById("productReviews");

    const productDescription =
        document.getElementById("productDescription");

    const productStock =
        document.getElementById("productStock");

    const quantityInput =
        document.getElementById("quantity");

    const productSku =
        document.getElementById("productSku");

    const productMetaCategory =
        document.getElementById("productMetaCategory");

    const productTag =
        document.getElementById("productTag");

    const decreaseQuantityButton =
        document.getElementById("decreaseQuantity");

    const increaseQuantityButton =
        document.getElementById("increaseQuantity");

    const addToCartButton =
        document.getElementById("addToCart");

    const addToWishlistButton =
        document.getElementById("addToWishlist");


    /* ---------------------------------------------
       GET PRODUCT FROM URL
    --------------------------------------------- */

    const productSlug =
        getRequestedProductSlug();

    const product = productSlug
        ? products[productSlug]
        : null;


    /* ---------------------------------------------
       PRODUCT NOT FOUND
    --------------------------------------------- */

    if (!product) {

        if (productName) {
            productName.textContent =
                "Product Not Found";
        }

        if (productDescription) {
            productDescription.textContent =
                "Sorry, this product could not be found. Please explore our collections.";
        }

        if (productPrice) {
            productPrice.textContent = "";
        }

        if (productImage) {
            productImage.removeAttribute("src");
            productImage.alt = "Product not found";
        }

        if (addToCartButton) {
            addToCartButton.disabled = true;
        }

        if (addToWishlistButton) {
            addToWishlistButton.disabled = true;
        }

        console.error(
            "Product not found.",
            {
                requestedURL: window.location.href,
                productSlug: productSlug
            }
        );

        return;
    }


    /* ---------------------------------------------
       DISPLAY PRODUCT INFORMATION
    --------------------------------------------- */

    document.title =
        `${product.name} | Luxury Jewelry`;

    // Load the product image
    loadProductImage(
        productImage,
        product
    );

    if (productCategory) {
        productCategory.textContent =
            product.collection;
    }

    if (productName) {
        productName.textContent =
            product.name;
    }

    if (productPrice) {
        productPrice.textContent =
            `$${product.price.toFixed(2)}`;
    }

    if (productReviews) {
        productReviews.textContent =
            "(Customer Reviews)";
    }

    if (productDescription) {
        productDescription.textContent =
            product.description;
    }

    if (productStock) {
        productStock.textContent =
            "In Stock";
    }

    if (productSku) {
        productSku.textContent =
            product.sku;
    }

    if (productMetaCategory) {
        productMetaCategory.textContent =
            product.category;
    }

    if (productTag) {
        productTag.textContent =
            product.collection;
    }


    /* ---------------------------------------------
       QUANTITY CONTROLS
    --------------------------------------------- */

    if (quantityInput) {
        quantityInput.value = "1";
        quantityInput.min = "1";
        quantityInput.max = "99";
    }


    if (decreaseQuantityButton) {
        decreaseQuantityButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                if (!quantityInput) {
                    return;
                }

                const currentQuantity =
                    parseInt(
                        quantityInput.value,
                        10
                    ) || 1;

                quantityInput.value = Math.max(
                    1,
                    currentQuantity - 1
                );
            }
        );
    }


    if (increaseQuantityButton) {
        increaseQuantityButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                if (!quantityInput) {
                    return;
                }

                const currentQuantity =
                    parseInt(
                        quantityInput.value,
                        10
                    ) || 1;

                quantityInput.value = Math.min(
                    99,
                    currentQuantity + 1
                );
            }
        );
    }


    if (quantityInput) {
        quantityInput.addEventListener(
            "change",
            function () {

                let quantity =
                    parseInt(
                        quantityInput.value,
                        10
                    );

                if (
                    Number.isNaN(quantity) ||
                    quantity < 1
                ) {
                    quantity = 1;
                }

                quantityInput.value =
                    Math.min(99, quantity);
            }
        );
    }


    /* ---------------------------------------------
       ADD TO CART
    --------------------------------------------- */

    if (addToCartButton) {

        addToCartButton.disabled = false;

        addToCartButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                if (!requireProductLogin()) {
                    return;
                }

                const cartKey =
                    getCartStorageKey();

                if (!cartKey) {
                    showProductMessage(
                        "Please login again to continue.",
                        "error"
                    );

                    return;
                }

                const quantity = quantityInput
                    ? Math.max(
                        1,
                        Math.min(
                            99,
                            parseInt(
                                quantityInput.value,
                                10
                            ) || 1
                        )
                    )
                    : 1;

                const cart =
                    readStorageArray(cartKey);

                const existingItem =
                    cart.find(function (item) {

                        if (typeof item === "string") {
                            return item === productSlug;
                        }

                        const itemSlug =
                            item.slug ||
                            item.productSlug ||
                            item.id;

                        return itemSlug === productSlug;
                    });


                if (
                    existingItem &&
                    typeof existingItem === "object"
                ) {

                    existingItem.quantity =
                        (
                            parseInt(
                                existingItem.quantity,
                                10
                            ) || 0
                        ) + quantity;

                } else {

                    cart.push({
                        id: productSlug,
                        slug: productSlug,
                        productSlug: productSlug,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        collection: product.collection,
                        category: product.category,
                        sku: product.sku,
                        quantity: quantity
                    });
                }


                if (!saveStorageArray(cartKey, cart)) {
                    showProductMessage(
                        "Unable to save your cart. Please try again.",
                        "error"
                    );

                    return;
                }

                notifyNavbarUpdate("cartUpdated");

                showProductMessage(
                    `${product.name} added to your cart.`
                );
            }
        );
    }


    /* ---------------------------------------------
       ADD TO FAVORITES
    --------------------------------------------- */

    if (addToWishlistButton) {

        addToWishlistButton.disabled = false;

        addToWishlistButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                if (!requireProductLogin()) {
                    return;
                }

                const favoritesKey =
                    getFavoritesStorageKey();

                if (!favoritesKey) {
                    showProductMessage(
                        "Please login again to continue.",
                        "error"
                    );

                    return;
                }

                const favorites =
                    readStorageArray(favoritesKey);

                const alreadyFavorite =
                    favorites.some(function (item) {

                        if (typeof item === "string") {
                            return item === productSlug;
                        }

                        const favoriteSlug =
                            item.slug ||
                            item.productSlug ||
                            item.id;

                        return favoriteSlug === productSlug;
                    });


                if (alreadyFavorite) {
                    showProductMessage(
                        "This product is already in your favorites.",
                        "error"
                    );

                    return;
                }


                favorites.push({
                    id: productSlug,
                    slug: productSlug,
                    productSlug: productSlug,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    collection: product.collection,
                    category: product.category,
                    sku: product.sku
                });


                if (
                    !saveStorageArray(
                        favoritesKey,
                        favorites
                    )
                ) {
                    showProductMessage(
                        "Unable to save favorites. Please try again.",
                        "error"
                    );

                    return;
                }

                notifyNavbarUpdate("favoritesUpdated");

                showProductMessage(
                    `${product.name} added to your favorites.`
                );
            }
        );
    }
}


/* =====================================================
   INITIALIZE PAGE
===================================================== */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeProductDetails,
        { once: true }
    );

} else {

    initializeProductDetails();
}