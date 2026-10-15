/* =====================================================
   LUXURY JEWELRY
   SIGN UP JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* GET HTML ELEMENTS */
    const body = document.body;
    const themeToggle = document.getElementById("themeToggle");
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.querySelector(".nav-links");

    const searchBtn = document.getElementById("searchBtn");
    const searchBox = document.getElementById("searchBox");
    const closeSearch = document.getElementById("closeSearch");
    const homeSearch = document.getElementById("homeSearch");

    const signupForm = document.getElementById("signupForm");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword =
        document.getElementById("toggleConfirmPassword");

    const profileImageInput = document.getElementById("profileImage");
    const cartCountElements = document.querySelectorAll(".cart-count");

    /* HASH PASSWORD USING SHA-256 */
    async function hashPassword(password) {
        if (!window.crypto || !window.crypto.subtle) {
            throw new Error(
                "Password hashing requires localhost or HTTPS."
            );
        }

        const data = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);

        return Array.from(new Uint8Array(hashBuffer))
            .map(byte => byte.toString(16).padStart(2, "0"))
            .join("");
    }

    /* READ REGISTERED USERS */
    function getUsers() {
        const savedUsers = localStorage.getItem("luxuryJewelryUsers");
        const users = savedUsers ? JSON.parse(savedUsers) : [];

        if (!Array.isArray(users)) {
            throw new Error("Registered users data is invalid.");
        }

        return users;
    }

    /* MIGRATE OLD PASSWORDS TO HASHES */
    async function migrateOldPasswords(users) {
        let changed = false;

        for (const user of users) {
            if (
                user &&
                typeof user.password === "string" &&
                user.password.length > 0
            ) {
                user.passwordHash = await hashPassword(user.password);
                delete user.password;
                changed = true;
            }
        }

        if (changed) {
            localStorage.setItem(
                "luxuryJewelryUsers",
                JSON.stringify(users)
            );
        }

        return users;
    }

    /* REMOVE PASSWORD DATA FROM THE SAVED SESSION */
    function cleanSavedSession() {
        const savedSession =
            localStorage.getItem("luxuryJewelryLoggedInUser");

        if (!savedSession) return;

        try {
            const sessionUser = JSON.parse(savedSession);

            if (sessionUser && typeof sessionUser === "object") {
                delete sessionUser.password;
                delete sessionUser.passwordHash;

                localStorage.setItem(
                    "luxuryJewelryLoggedInUser",
                    JSON.stringify(sessionUser)
                );
            }
        } catch (error) {
            console.error("Could not clean saved session:", error);
        }
    }

    /* LOAD SAVED THEME */
    const savedTheme = localStorage.getItem("luxuryJewelryTheme");

    if (savedTheme === "dark") {
        body.classList.add("dark-mode");
        if (themeToggle) themeToggle.textContent = "☀";
    } else {
        body.classList.remove("dark-mode");
        if (themeToggle) themeToggle.textContent = "☾";
    }

    /* TOGGLE THEME */
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            body.classList.toggle("dark-mode");

            const isDark = body.classList.contains("dark-mode");

            localStorage.setItem(
                "luxuryJewelryTheme",
                isDark ? "dark" : "light"
            );

            themeToggle.textContent = isDark ? "☀" : "☾";
        });
    }

    /* MOBILE MENU */
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            menuToggle.classList.toggle("active");
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                menuToggle.classList.remove("active");
            });
        });
    }

    /* OPEN SEARCH */
    if (searchBtn && searchBox) {
        searchBtn.addEventListener("click", () => {
            searchBox.classList.add("active");
            if (homeSearch) homeSearch.focus();
        });
    }

    /* CLOSE SEARCH */
    if (closeSearch && searchBox) {
        closeSearch.addEventListener("click", () => {
            searchBox.classList.remove("active");
        });
    }

    /* SEARCH PRODUCTS */
    if (homeSearch) {
        homeSearch.addEventListener("keydown", event => {
            if (event.key !== "Enter") return;

            const searchValue = homeSearch.value.trim();

            if (searchValue) {
                window.location.href =
                    "shop.html?search=" +
                    encodeURIComponent(searchValue);
            }
        });
    }

    /* SHOW OR HIDE PASSWORD */
    function setupPasswordToggle(button, input) {
        if (!button || !input) return;

        button.addEventListener("click", () => {
            const showing = input.type === "password";
            input.type = showing ? "text" : "password";
            button.textContent = showing ? "Hide" : "Show";
        });
    }

    setupPasswordToggle(togglePassword, passwordInput);
    setupPasswordToggle(toggleConfirmPassword, confirmPasswordInput);

    /* SIGNUP FORM */
    if (signupForm) {
        signupForm.addEventListener("submit", async event => {
            event.preventDefault();

            const fullName =
                document.getElementById("fullName")?.value.trim() || "";

            const email =
                document.getElementById("email")?.value.trim().toLowerCase() || "";

            const password = passwordInput?.value ?? "";
            const confirmPassword = confirmPasswordInput?.value ?? "";

            /* VALIDATE FORM */
            if (fullName.length < 2) {
                alert("Please enter your full name.");
                return;
            }

            if (!email) {
                alert("Please enter your email address.");
                return;
            }

            if (password.length < 6) {
                alert("Password must be at least 6 characters long.");
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            const file = profileImageInput?.files?.[0] || null;

            if (file) {
                const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/webp",
                    "image/gif"
                ];

                if (!allowedTypes.includes(file.type)) {
                    alert("Please choose a JPG, PNG, WEBP or GIF image.");
                    return;
                }

                if (file.size > 2 * 1024 * 1024) {
                    alert("Please choose a profile photo smaller than 2 MB.");
                    return;
                }
            }

            try {
                /* READ USERS AND MIGRATE LEGACY PASSWORDS */
                let users = getUsers();
                users = await migrateOldPasswords(users);

                /* CHECK DUPLICATE EMAIL */
                const existingUser = users.find(user =>
                    typeof user?.email === "string" &&
                    user.email.trim().toLowerCase() === email
                );

                if (existingUser) {
                    alert("An account with this email already exists.");
                    return;
                }

                /* HASH THE PASSWORD BEFORE SAVING */
                const passwordHash = await hashPassword(password);

                /* SAVE PROFILE IMAGE */
                const saveUser = profileImage => {
                    const newUser = {
                        id: Date.now(),
                        fullName,
                        email,
                        passwordHash,
                        profileImage: profileImage || "",
                        createdAt: new Date().toISOString()
                    };

                    users.push(newUser);

                    try {
                        localStorage.setItem(
                            "luxuryJewelryUsers",
                            JSON.stringify(users)
                        );

                        alert("Account created successfully. Please log in.");
                        window.location.href = "login.html";
                    } catch (error) {
                        console.error("Could not save account:", error);
                        alert(
                            "Unable to save the account. Storage may be full."
                        );
                    }
                };

                if (file) {
                    const reader = new FileReader();

                    reader.onload = () => saveUser(reader.result);

                    reader.onerror = () => {
                        alert("There was a problem reading the profile photo.");
                    };

                    reader.readAsDataURL(file);
                } else {
                    saveUser("");
                }
            } catch (error) {
                console.error("Signup failed:", error);
                alert(
                    "Unable to create the account. Please use localhost or HTTPS and try again."
                );
            }
        });
    }

    /* UPDATE CART COUNT */
    function updateCartCount() {
        let cart = [];

        try {
            cart = JSON.parse(
                localStorage.getItem("luxuryJewelryCart") || "[]"
            );

            if (!Array.isArray(cart)) cart = [];
        } catch (error) {
            cart = [];
        }

        let totalItems = 0;

        cart.forEach(item => {
            totalItems += Number(item.quantity) || 1;
        });

        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }

    updateCartCount();

    /* CLOSE MENU AND SEARCH WITH ESCAPE */
    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;

        if (searchBox) searchBox.classList.remove("active");
        if (navLinks) navLinks.classList.remove("active");
        if (menuToggle) menuToggle.classList.remove("active");
    });

    /* CLEAN ANY EXISTING SESSION DATA */
    cleanSavedSession();
});