/* =====================================================
   LUXURY JEWELRY
   PROFILE PAGE JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* 1. ELEMENTS */

    const profileForm = document.getElementById("profileForm");
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const country = document.getElementById("country");

    const profileImage = document.getElementById("profileImage");
    const profilePlaceholder = document.getElementById("profilePlaceholder");
    const photoInput = document.getElementById("photoInput");
    const editProfileButton = document.getElementById("editProfileButton");
    const deleteProfileButton = document.getElementById("deleteProfileButton");

    const profileThemeToggle = document.getElementById("profileThemeToggle");
    const profileToast = document.getElementById("profileToast");

    const ordersToggleButton = document.getElementById("ordersToggleButton");
    const profileOrders = document.getElementById("profileOrders");
    const profileOrdersContent = document.getElementById("profileOrdersContent");

    const passwordForm = document.getElementById("passwordForm");
    const currentPassword = document.getElementById("currentPassword");
    const newPassword = document.getElementById("newPassword");
    const confirmPassword = document.getElementById("confirmPassword");


    /* 2. CURRENT USER */

    function getCurrentUser() {
        try {
            const savedUser = localStorage.getItem(
                "luxuryJewelryLoggedInUser"
            );

            if (!savedUser) return null;

            const user = JSON.parse(savedUser);

            return user && typeof user === "object" ? user : null;

        } catch (error) {
            console.error("Could not read user:", error);
            return null;
        }
    }


    /* 3. USER STORAGE KEY */

    function getUserKey() {
        const user = getCurrentUser();

        if (!user) return null;

        const identifier = user.id || user.userId || user.email;

        if (!identifier) return null;

        return String(identifier)
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9_-]/g, "_");
    }

    const userKey = getUserKey();

    if (!getCurrentUser() || !userKey) {
        window.location.href = "login.html";
        return;
    }

    function getProfileStorageKey() {
        return "luxuryJewelryProfile_" + userKey;
    }

    function getOrdersStorageKey() {
        return "luxuryJewelryOrders_" + userKey;
    }

    function getPasswordStorageKey() {
        return "luxuryJewelryPassword_" + userKey;
    }


    /* 4. LOCAL STORAGE HELPERS */

    function readJSON(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value === null ? fallback : JSON.parse(value);
        } catch (error) {
            console.error("Could not read storage:", error);
            return fallback;
        }
    }

    function getProfileData() {
        const profile = readJSON(getProfileStorageKey(), {});

        if (
            profile &&
            typeof profile === "object" &&
            !Array.isArray(profile)
        ) {
            return profile;
        }

        return {};
    }

    function saveProfileData(profile) {
        try {
            localStorage.setItem(
                getProfileStorageKey(),
                JSON.stringify(profile)
            );
            return true;
        } catch (error) {
            showToast("Could not save profile. Storage may be full.");
            return false;
        }
    }

    function updateLoggedInUser(changes) {
        const user = getCurrentUser();

        if (!user) return false;

        try {
            localStorage.setItem(
                "luxuryJewelryLoggedInUser",
                JSON.stringify({ ...user, ...changes })
            );
            return true;
        } catch (error) {
            showToast("Could not update account information.");
            return false;
        }
    }


    /* 5. TOAST MESSAGE */

    let toastTimer;

    function showToast(message) {
        if (!profileToast) {
            alert(message);
            return;
        }

        profileToast.textContent = message;
        profileToast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            profileToast.classList.remove("show");
        }, 2800);
    }


    /* 6. USER INITIAL */

    function getUserInitial() {
        const user = getCurrentUser() || {};
        const profile = getProfileData();

        const name = String(
            profile.fullName || user.fullName || user.name || ""
        ).trim();

        if (name) {
            return Array.from(name)[0].toLocaleUpperCase();
        }

        const userEmail = String(
            profile.email || user.email || ""
        ).trim();

        if (userEmail) {
            return Array.from(userEmail)[0].toLocaleUpperCase();
        }

        return "?";
    }


    /* 7. DISPLAY INITIAL */

    function displayProfilePlaceholder() {
        if (profileImage) {
            profileImage.hidden = true;
            profileImage.removeAttribute("src");
            profileImage.style.display = "none";
        }

        if (profilePlaceholder) {
            profilePlaceholder.textContent = getUserInitial();
            profilePlaceholder.hidden = false;
            profilePlaceholder.classList.remove("hidden");
            profilePlaceholder.style.display = "";

            profilePlaceholder.setAttribute(
                "aria-label",
                "Profile initial " + getUserInitial()
            );
        }
    }


    /* 8. DISPLAY PROFILE PHOTO */

    function displayProfilePhoto(photo) {
        if (!photo || !profileImage) {
            displayProfilePlaceholder();
            return;
        }

        profileImage.hidden = false;
        profileImage.style.display = "";

        profileImage.onerror = function () {
            displayProfilePlaceholder();
        };

        profileImage.onload = function () {
            if (profilePlaceholder) {
                profilePlaceholder.hidden = true;
                profilePlaceholder.classList.add("hidden");
                profilePlaceholder.style.display = "none";
            }
        };

        profileImage.src = photo;

        if (profilePlaceholder) {
            profilePlaceholder.hidden = true;
            profilePlaceholder.classList.add("hidden");
            profilePlaceholder.style.display = "none";
        }
    }


    /* 9. UPDATE NAVBAR AVATAR */

    function notifyProfilePhotoUpdated() {
        const profile = getProfileData();

        window.dispatchEvent(
            new CustomEvent("profilePhotoUpdated", {
                detail: {
                    userKey: userKey,
                    photo: profile.photo || "",
                    initial: getUserInitial()
                }
            })
        );
    }


    /* 10. OPEN PHOTO SELECTOR */

    if (editProfileButton && photoInput) {
        editProfileButton.addEventListener("click", function () {
            photoInput.click();
        });
    }


    /* 11. SELECT AND SAVE PHOTO */

    if (photoInput) {
        photoInput.addEventListener("change", function () {
            const file = photoInput.files && photoInput.files[0];

            if (!file) return;

            if (!file.type.startsWith("image/")) {
                showToast("Please select a valid image.");
                photoInput.value = "";
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                showToast("Please select an image smaller than 5 MB.");
                photoInput.value = "";
                return;
            }

            const reader = new FileReader();

            reader.onload = function (event) {
                const photo = event.target.result;
                const profile = getProfileData();

                profile.photo = photo;

                if (!saveProfileData(profile)) return;

                displayProfilePhoto(photo);
                notifyProfilePhotoUpdated();

                showToast("Profile photo saved successfully.");
                photoInput.value = "";
            };

            reader.onerror = function () {
                showToast("Could not read the selected image.");
            };

            reader.readAsDataURL(file);
        });
    }


    /* 12. LOAD PROFILE INFORMATION */

    function loadProfile() {
        const user = getCurrentUser();
        const profile = getProfileData();

        if (!user) return;

        if (fullName) {
            fullName.value =
                profile.fullName || user.fullName || user.name || "";
        }

        if (email) {
            email.value = profile.email || user.email || "";
        }

        if (phone) {
            phone.value =
                profile.phone || user.phone || user.phoneNumber || "";
        }

        if (country) {
            country.value = profile.country || user.country || "";
        }

        if (profile.photo) {
            displayProfilePhoto(profile.photo);
        } else {
            displayProfilePlaceholder();
        }
    }


    /* 13. SAVE PROFILE INFORMATION */

    if (profileForm) {
        profileForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const nameValue = fullName ? fullName.value.trim() : "";
            const emailValue = email ? email.value.trim() : "";
            const phoneValue = phone ? phone.value.trim() : "";
            const countryValue = country ? country.value.trim() : "";

            if (!nameValue) {
                showToast("Please enter your full name.");
                return;
            }

            if (
                emailValue &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)
            ) {
                showToast("Please enter a valid email address.");
                return;
            }

            const profile = {
                ...getProfileData(),
                fullName: nameValue,
                email: emailValue,
                phone: phoneValue,
                country: countryValue
            };

            if (!saveProfileData(profile)) return;

            const updated = updateLoggedInUser({
                fullName: nameValue,
                name: nameValue,
                email: emailValue,
                phone: phoneValue,
                phoneNumber: phoneValue,
                country: countryValue
            });

            if (updated) {
                if (!profile.photo) {
                    displayProfilePlaceholder();
                }

                notifyProfilePhotoUpdated();
                showToast("Profile updated successfully.");
            }
        });
    }


    /* 14. DELETE PROFILE INFORMATION */

    if (deleteProfileButton) {
        deleteProfileButton.addEventListener("click", function () {
            const confirmed = window.confirm(
                "Delete your saved profile information and photo?"
            );

            if (!confirmed) return;

            const user = getCurrentUser();

            try {
                localStorage.removeItem(getProfileStorageKey());

                if (user) {
                    updateLoggedInUser({
                        fullName: user.name || "",
                        phone: "",
                        phoneNumber: "",
                        country: ""
                    });
                }

                loadProfile();
                notifyProfilePhotoUpdated();

                showToast("Saved profile information deleted.");

            } catch (error) {
                showToast("Could not delete profile information.");
            }
        });
    }


    /* 15. FORMAT PRICE */

    function formatPrice(value) {
        const amount = Number(value);

        return "$" + (
            Number.isFinite(amount) ? amount : 0
        ).toFixed(2);
    }


    /* 16. FORMAT ORDER DATE */

    function formatOrderDate(value) {
        if (!value) return "Date unavailable";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "Date unavailable";
        }

        return date.toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }


    /* 17. ESCAPE HTML */

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* 18. VALIDATE ORDER IMAGE URL */

    function safeImageURL(value) {
        const image = String(value || "").trim();

        if (
            image.startsWith("data:image/") ||
            image.startsWith("images/") ||
            image.startsWith("./images/") ||
            image.startsWith("../images/") ||
            image.startsWith("/")
        ) {
            return image;
        }

        try {
            const parsed = new URL(image, window.location.href);

            if (
                parsed.protocol === "http:" ||
                parsed.protocol === "https:"
            ) {
                return parsed.href;
            }
        } catch (error) {
            // Use the default image if the URL is invalid.
        }

        return "images/logo.jpeg";
    }


    /* 19. LOAD MY ORDERS */

    function loadProfileOrders() {
        if (!profileOrdersContent) return;

        const storedOrders = readJSON(getOrdersStorageKey(), []);

        const orders = Array.isArray(storedOrders)
            ? storedOrders.filter(function (order) {
                return order && typeof order === "object";
            })
            : [];

        if (orders.length === 0) {
            profileOrdersContent.innerHTML = `
                <div class="empty-orders">
                    <h3>No Orders Yet</h3>
                    <p>
                        Your completed checkout orders
                        will appear here.
                    </p>
                    <a href="shop.html" class="order-shop-link">
                        Explore Collection
                    </a>
                </div>
            `;
            return;
        }

        // Sort orders by date, newest first.
        const sortedOrders = [...orders].sort(function (a, b) {
            const dateA = new Date(a.createdAt || 0).getTime() || 0;
            const dateB = new Date(b.createdAt || 0).getTime() || 0;

            return dateB - dateA;
        });

        profileOrdersContent.innerHTML = sortedOrders.map(function (order) {
            const items = Array.isArray(order.items) ? order.items : [];

            const productsHTML = items.length
                ? items.map(function (item) {
                    const quantity = Math.max(
                        1,
                        Number(item.quantity) || 1
                    );

                    const price = Number(
                        item.price ?? item.unitPrice ?? 0
                    ) || 0;

                    const productName =
                        item.name ||
                        item.productName ||
                        item.title ||
                        "Jewelry Item";

                    const image = safeImageURL(
                        item.image ||
                        item.productImage ||
                        item.img ||
                        ""
                    );

                    return `
                        <div class="order-product">
                            <img
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(productName)}"
                                class="order-product-image"
                                loading="lazy"
                            >

                            <div class="order-product-info">
                                <h4>${escapeHTML(productName)}</h4>
                                <p>Quantity: ${quantity}</p>
                            </div>

                            <p class="order-product-price">
                                ${formatPrice(price * quantity)}
                            </p>
                        </div>
                    `;
                }).join("")
                : `
                    <p class="order-empty-products">
                        Product details unavailable.
                    </p>
                `;

            const addressParts = [
                order.deliveryAddress,
                order.city,
                order.country
            ].filter(Boolean);

            const deliveryAddress = addressParts.length
                ? addressParts.join(", ")
                : "Address unavailable";

            return `
                <article class="order-card">
                    <div class="order-card-header">
                        <div>
                            <h3>
                                Order #${escapeHTML(
                                    order.orderId || "Unavailable"
                                )}
                            </h3>

                            <p class="order-date">
                                ${escapeHTML(
                                    formatOrderDate(order.createdAt)
                                )}
                            </p>
                        </div>

                        <span class="order-status">
                            ${escapeHTML(order.status || "Processing")}
                        </span>
                    </div>

                    <div class="order-products">
                        ${productsHTML}
                    </div>

                    <div class="order-details">
                        <p>
                            <strong>Payment:</strong>
                            ${escapeHTML(
                                order.paymentMethod || "Not specified"
                            )}
                        </p>

                        <p>
                            <strong>Delivery:</strong>
                            ${escapeHTML(deliveryAddress)}
                        </p>

                        ${order.phoneNumber ? `
                            <p>
                                <strong>Phone:</strong>
                                ${escapeHTML(order.phoneNumber)}
                            </p>
                        ` : ""}
                    </div>

                    <div class="order-total">
                        <span>Order Total</span>
                        <strong>${formatPrice(order.total)}</strong>
                    </div>
                </article>
            `;
        }).join("");
    }


    /* 20. OPEN AND CLOSE MY ORDERS */

    if (ordersToggleButton && profileOrders) {
        ordersToggleButton.addEventListener("click", function () {
            const shouldOpen = profileOrders.hidden;

            profileOrders.hidden = !shouldOpen;

            ordersToggleButton.setAttribute(
                "aria-expanded",
                String(shouldOpen)
            );

            if (shouldOpen) {
                loadProfileOrders();

                profileOrders.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest"
                });
            }
        });
    }


    /* 21. APPLY THEME */

    function applyTheme() {
        const savedTheme = localStorage.getItem(
            "luxuryJewelryTheme"
        );

        const isDark = savedTheme === "dark";

        document.body.classList.toggle("dark-mode", isDark);

        if (profileThemeToggle) {
            profileThemeToggle.textContent = isDark ? "☀" : "☾";

            profileThemeToggle.setAttribute(
                "aria-label",
                isDark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );
        }
    }


    /* 22. TOGGLE THEME */

    if (profileThemeToggle) {
        profileThemeToggle.addEventListener("click", function () {
            const isDark =
                document.body.classList.toggle("dark-mode");

            localStorage.setItem(
                "luxuryJewelryTheme",
                isDark ? "dark" : "light"
            );

            profileThemeToggle.textContent = isDark ? "☀" : "☾";

            profileThemeToggle.setAttribute(
                "aria-label",
                isDark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );
        });
    }


    /* 23. INITIALIZE PROFILE PAGE */

    applyTheme();
    loadProfile();
    loadProfileOrders();

});