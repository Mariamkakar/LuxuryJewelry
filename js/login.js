/* =====================================================
   LUXURY JEWELRY
   LOGIN JAVASCRIPT
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

    const loginForm = document.getElementById("loginForm");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const forgotPassword = document.getElementById("forgotPassword");

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
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
            const showing = passwordInput.type === "password";

            passwordInput.type = showing ? "text" : "password";
            togglePassword.textContent = showing ? "Hide" : "Show";
        });
    }

    /* LOGIN FORM */
    if (loginForm) {
        loginForm.addEventListener("submit", async event => {
            event.preventDefault();

            const emailInput = document.getElementById("email");
            const email = emailInput
                ? emailInput.value.trim().toLowerCase()
                : "";

            const password = passwordInput?.value ?? "";

            if (!email || !password) {
                alert("Please enter your email and password.");
                return;
            }

            try {
                /* READ USERS AND CONVERT LEGACY PASSWORDS */
                let users = getUsers();
                users = await migrateOldPasswords(users);

                /* HASH THE ENTERED PASSWORD */
                const enteredHash = await hashPassword(password);

                /* FIND USER BY EMAIL AND PASSWORD HASH */
                const user = users.find(registeredUser =>
                    registeredUser &&
                    typeof registeredUser.email === "string" &&
                    typeof registeredUser.passwordHash === "string" &&
                    registeredUser.email.trim().toLowerCase() === email &&
                    registeredUser.passwordHash === enteredHash
                );

                if (!user) {
                    alert("Invalid email or password. Please try again.");
                    return;
                }

                /* SAVE SESSION WITHOUT PASSWORD DATA */
                const sessionUser = { ...user };

                delete sessionUser.password;
                delete sessionUser.passwordHash;

                localStorage.setItem(
                    "luxuryJewelryLoggedInUser",
                    JSON.stringify(sessionUser)
                );

                /* SAVE REMEMBER ME CHOICE */
                const rememberMe = document.getElementById("rememberMe");

                if (rememberMe && rememberMe.checked) {
                    localStorage.setItem(
                        "luxuryJewelryRememberMe",
                        "true"
                    );
                } else {
                    localStorage.removeItem("luxuryJewelryRememberMe");
                }

                /* REDIRECT TO HOME PAGE */
                window.location.href = "index.html";
            } catch (error) {
                console.error("Login failed:", error);
                alert(
                    "Unable to complete login. Please use localhost or HTTPS and try again."
                );
            }
        });
    }
/* FORGOT PASSWORD - CHECK EMAIL AND CHANGE PASSWORD */
if (forgotPassword) {
    forgotPassword.addEventListener("click", async (event) => {
        event.preventDefault();

        // Ask the user for their registered email
        const { value: email, isConfirmed } = await Swal.fire({
            title: "Forgot Password?",
            text: "Enter the email you used to create your account.",
            input: "email",
            inputPlaceholder: "Enter your email address",
            confirmButtonText: "Verify Email",
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonColor: "#c99a3b",
            background: "#faf8f3",
            color: "#333333",
            inputValidator: (value) => {
                if (!value || !value.trim()) {
                    return "Please enter your email address.";
                }
            }
        });

        if (!isConfirmed || !email) return;

        // Get the registered users from localStorage
        let users = [];

        try {
            const possibleKeys = [
                "luxuryJewelryUsers",
                "luxuryJewelryRegisteredUsers",
                "users"
            ];

            for (const key of possibleKeys) {
                const storedUsers = localStorage.getItem(key);

                if (storedUsers) {
                    const parsedUsers = JSON.parse(storedUsers);

                    if (Array.isArray(parsedUsers)) {
                        users = parsedUsers;
                        break;
                    }
                }
            }

            // Check whether the email belongs to a registered user
            const normalizedEmail = email.trim().toLowerCase();

            const user = users.find((item) =>
                item.email &&
                item.email.trim().toLowerCase() === normalizedEmail
            );

            if (!user) {
                await Swal.fire({
                    icon: "error",
                    title: "Email Not Found",
                    text: "This email is not registered. Please enter your registered email address.",
                    confirmButtonColor: "#c99a3b"
                });

                return;
            }

            // Ask the verified user to enter a new password
            const { value: newPassword, isConfirmed: passwordConfirmed } =
                await Swal.fire({
                    title: "Create New Password",
                    html: `
                        <p style="margin-bottom:15px;">
                            Email verified successfully.
                        </p>
                    `,
                    input: "password",
                    inputPlaceholder: "Enter your new password",
                    inputAttributes: {
                        minlength: 8,
                        autocomplete: "new-password"
                    },
                    showCancelButton: true,
                    confirmButtonText: "Change Password",
                    cancelButtonText: "Cancel",
                    confirmButtonColor: "#c99a3b",
                    background: "#faf8f3",
                    color: "#333333",
                    inputValidator: (value) => {
                        if (!value) {
                            return "Please enter a new password.";
                        }

                        if (value.length < 8) {
                            return "Password must contain at least 8 characters.";
                        }
                    }
                });

            if (!passwordConfirmed || !newPassword) return;

            // Update the password in the registered users list
            const userIndex = users.findIndex((item) =>
                item.email &&
                item.email.trim().toLowerCase() === normalizedEmail
            );

            if (userIndex === -1) {
                throw new Error("User account could not be found.");
            }

            // Update only the password field
            users[userIndex].password = newPassword;

            // Save the updated users list
            let storageKey = "luxuryJewelryUsers";

            for (const key of [
                "luxuryJewelryUsers",
                "luxuryJewelryRegisteredUsers",
                "users"
            ]) {
                const storedUsers = localStorage.getItem(key);

                if (storedUsers) {
                    const parsedUsers = JSON.parse(storedUsers);

                    if (Array.isArray(parsedUsers)) {
                        storageKey = key;
                        break;
                    }
                }
            }

            localStorage.setItem(storageKey, JSON.stringify(users));

            // Show the success message
            await Swal.fire({
                icon: "success",
                title: "Password Changed!",
                text: "Your password has been updated successfully. You can now log in with your new password.",
                confirmButtonText: "Go to Login",
                confirmButtonColor: "#c99a3b",
                background: "#faf8f3",
                color: "#333333"
            });

        } catch (error) {
            console.error("Password reset error:", error);

            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Unable to update your password. Please check your registered user data.",
                confirmButtonColor: "#c99a3b"
            });
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

    /* CLOSE SEARCH AND MENU WITH ESCAPE */
    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;

        if (searchBox) searchBox.classList.remove("active");
        if (navLinks) navLinks.classList.remove("active");
        if (menuToggle) menuToggle.classList.remove("active");
    });
});