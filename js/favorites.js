/* =====================================================
   FAVORITES PAGE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadFavorites();

    }
);


/* =====================================================
   LOAD FAVORITES
===================================================== */

function loadFavorites() {

    const favoritesGrid =
        document.getElementById(
            "favoritesGrid"
        );

    const favoritesEmpty =
        document.getElementById(
            "favoritesEmpty"
        );


    if (
        !favoritesGrid ||
        !favoritesEmpty
    ) {
        return;
    }


    let favorites = [];


    try {

        favorites =
            JSON.parse(
                localStorage.getItem(
                    "luxuryJewelryFavorites"
                )
            ) || [];

    } catch (error) {

        console.error(
            "Favorites loading error:",
            error
        );

        favorites = [];

    }


    favoritesGrid.innerHTML = "";


    /* ------------------------------------
       EMPTY
    ------------------------------------ */

    if (!favorites.length) {

        favoritesGrid.style.display =
            "none";

        favoritesEmpty.classList.add(
            "show"
        );

        return;
    }


    /* ------------------------------------
       PRODUCTS EXIST
    ------------------------------------ */

    favoritesGrid.style.display =
        "grid";

    favoritesEmpty.classList.remove(
        "show"
    );


    favorites.forEach(
        function (product, index) {

            const card =
                createFavoriteCard(
                    product,
                    index
                );

            favoritesGrid.appendChild(card);

        }
    );
}


/* =====================================================
   CREATE FAVORITE CARD
===================================================== */

function createFavoriteCard(
    product,
    index
) {

    const card =
        document.createElement("article");

    card.className =
        "favorite-card";


    const name =
        product.name ||
        "Jewelry";

    const price =
        Number(product.price) || 0;

    const image =
        product.image ||
        "";

    const category =
        product.category ||
        getProductCategory(name);


    card.innerHTML = `

        <div class="favorite-image">

            <img
                src="${image}"
                alt="${name}"
            >

            <button
                type="button"
                class="remove-favorite"
                data-index="${index}"
                aria-label="Remove ${name} from favorites"
            >
                ♥
            </button>

        </div>


        <div class="favorite-info">

            <p class="favorite-category">
                ${category}
            </p>

            <h3>
                ${name}
            </h3>

            <p class="favorite-price">
                $${price.toFixed(2)}
            </p>


            <div class="favorite-actions">

                <button
                    type="button"
                    class="favorite-cart-btn"
                    data-index="${index}"
                >
                    Add to Cart
                </button>

                <button
                    type="button"
                    class="favorite-view-btn"
                    data-index="${index}"
                >
                    View
                </button>

            </div>

        </div>

    `;


    /* ------------------------------------
       REMOVE
    ------------------------------------ */

    const removeButton =
        card.querySelector(
            ".remove-favorite"
        );


    removeButton.addEventListener(
        "click",
        function () {

            removeFavorite(index);

        }
    );


    /* ------------------------------------
       ADD TO CART
    ------------------------------------ */

    const cartButton =
        card.querySelector(
            ".favorite-cart-btn"
        );


    cartButton.addEventListener(
        "click",
        function () {

            addFavoriteToCart(product);

        }
    );


    /* ------------------------------------
       VIEW PRODUCT
    ------------------------------------ */

    const viewButton =
        card.querySelector(
            ".favorite-view-btn"
        );


    viewButton.addEventListener(
        "click",
        function () {

            goToProduct(product);

        }
    );


    return card;
}


/* =====================================================
   REMOVE FAVORITE
===================================================== */

function removeFavorite(index) {

    try {

        const favorites =
            JSON.parse(
                localStorage.getItem(
                    "luxuryJewelryFavorites"
                )
            ) || [];


        favorites.splice(index, 1);


        localStorage.setItem(
            "luxuryJewelryFavorites",
            JSON.stringify(favorites)
        );


        /* Tell Navbar to update count */

        window.dispatchEvent(
            new Event(
                "favoritesUpdated"
            )
        );


        loadFavorites();


    } catch (error) {

        console.error(
            "Remove favorite error:",
            error
        );

    }
}


/* =====================================================
   ADD FAVORITE TO CART
===================================================== */

function addFavoriteToCart(product) {

    let cart = [];


    try {

        cart =
            JSON.parse(
                localStorage.getItem(
                    "luxuryJewelryCart"
                )
            ) || [];

    } catch (error) {

        cart = [];

    }


    const existingProduct =
        cart.find(
            function (item) {

                return (
                    item.name ===
                    product.name
                );

            }
        );


    if (existingProduct) {

        existingProduct.quantity =
            (Number(
                existingProduct.quantity
            ) || 1) + 1;

    } else {

        cart.push({

            name:
                product.name,

            price:
                Number(product.price) || 0,

            image:
                product.image || "",

            quantity:
                1

        });

    }


    localStorage.setItem(
        "luxuryJewelryCart",
        JSON.stringify(cart)
    );


    window.dispatchEvent(
        new Event(
            "cartUpdated"
        )
    );


    alert(
        product.name +
        " has been added to your cart."
    );
}


/* =====================================================
   PRODUCT CATEGORY
===================================================== */

function getProductCategory(name) {

    const text =
        String(name)
            .toLowerCase();


    if (
        text.includes("ring")
    ) {
        return "Rings";
    }


    if (
        text.includes("necklace")
    ) {
        return "Necklaces";
    }


    if (
        text.includes("earring")
    ) {
        return "Earrings";
    }


    if (
        text.includes("bracelet")
    ) {
        return "Bracelets";
    }


    if (
        text.includes("set")
    ) {
        return "Jewelry Sets";
    }


    return "Jewelry";
}


/* =====================================================
   VIEW PRODUCT
===================================================== */

function goToProduct(product) {

    const name =
        encodeURIComponent(
            product.name || ""
        );


    window.location.href =
        "shop.html?search=" + name;
}


/* =====================================================
   UPDATE WHEN FAVORITES CHANGE
===================================================== */

window.addEventListener(
    "favoritesUpdated",
    function () {

        loadFavorites();

    }
);


/* =====================================================
   UPDATE FROM OTHER TABS
===================================================== */

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key ===
            "luxuryJewelryFavorites"
        ) {

            loadFavorites();

        }

    }
);