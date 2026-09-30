/* =====================================================
  HSIS PAGE IS LUXURY JEWELRY
   LOGIN JAVASCRIPT
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    /* =========================
       ELEMENTS
    ========================== */
    const body =
        document.body;
    const themeToggle =
        document.getElementById("themeToggle"); 
    const menuToggle =
        document.getElementById("menuToggle");
    const navLinks =
        document.querySelector(".nav-links");
    const searchBtn =
        document.getElementById("searchBtn");
    const searchBox =
        document.getElementById("searchBox");
    const closeSearch =
        document.getElementById("closeSearch");
    const homeSearch =
        document.getElementById("homeSearch");
    const loginForm =
        document.getElementById("loginForm");
    const passwordInput =
        document.getElementById("password");
    const togglePassword =
        document.getElementById("togglePassword");
    const forgotPassword =
        document.getElementById("forgotPassword");
    const cartCountElements =
        document.querySelectorAll(".cart-count");
    /* =====================================================
       Disply DARK MODE
    ===================================================== */
    const savedTheme =
        localStorage.getItem(
            "luxuryJewelryTheme"
        );
    if (savedTheme === "dark") {
        body.classList.add(
            "dark-mode"
        );
        if (themeToggle) {
            themeToggle.textContent =
                "☀";
        }
    } else {
        body.classList.remove(
            "dark-mode"
        );
        if (themeToggle) {
            themeToggle.textContent =
                "☾";
        }
    }
    /* =========================
       THEME TOGGLE
    ========================== */
    if (themeToggle) {
        themeToggle.addEventListener(
            "click",
            () => {
                body.classList.toggle(
                    "dark-mode"
                );
                const isDark =
                    body.classList.contains(
                        "dark-mode"
                    );
                localStorage.setItem(
                    "luxuryJewelryTheme",
                    isDark
                        ? "dark"
                        : "light"
                );
                themeToggle.textContent =
                    isDark
                        ? "☀"
                        : "☾";
            }
        );
    }
    /* =====================================================
       MOBILE MENU
    ===================================================== */
    if (
        menuToggle &&
        navLinks
    ) {
        menuToggle.addEventListener(
            "click",
            () => {
                navLinks.classList.toggle(
                    "active"
                );
                menuToggle.classList.toggle(
                    "active"
                );
            }
        );
        navLinks
            .querySelectorAll("a")
            .forEach(link => {
                link.addEventListener(
                    "click",
                    () => {
                        navLinks.classList.remove(
                            "active"
                        );
                        menuToggle.classList.remove(
                            "active"
                        );
                    }
                );
            });
    }
    /* =====================================================
       SEARCH BOX
    ===================================================== */
    if (
        searchBtn &&
        searchBox
    ) {
        searchBtn.addEventListener(
            "click",
            () => {
                searchBox.classList.add(
                    "active"
                );
                if (homeSearch) {
                    homeSearch.focus();
                }
            }
        );
    }
    /* =========================
       CLOSE SEARCH
    ========================== */
    if (
        closeSearch &&
        searchBox
    ) {
        closeSearch.addEventListener(
            "click",
            () => {
                searchBox.classList.remove(
                    "active"
                );
            }
        );
    }
    /* =====================================================
       SEARCH FUNCTION
    ===================================================== */
    if (homeSearch) {
        homeSearch.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key !==
                    "Enter"
                ) {
                    return;
                }
                const searchValue =
                    homeSearch.value.trim();
                if (
                    searchValue === ""
                ) {
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
       SHOW / HIDE PASSWORD
    ===================================================== */
    if (
        togglePassword &&
        passwordInput
    ) {
        togglePassword.addEventListener(
            "click",
            () => {
                if (
                    passwordInput.type ===
                    "password"
                ) {
                    passwordInput.type =
                        "text";
                    togglePassword.textContent =
                        "Hide";
                } else {
                    passwordInput.type =
                        "password";
                    togglePassword.textContent =
                        "Show";
                }
            }
        );
    }
    /* =====================================================
       LOGIN FORM
    ===================================================== */
    if (loginForm) {
        loginForm.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();
                /* =========================
                   GET FORM VALUES
                ========================== */
                const emailInput =
                    document.getElementById(
                        "email"
                    );
                const email =
                    emailInput
                        ? emailInput.value
                            .trim()
                            .toLowerCase()
                        : "";
                const password =
                    passwordInput
                        ? passwordInput.value.trim()
                        : "";
                /* =========================
                   VALIDATE INPUT
                ========================== */
                if (
                    email === "" ||
                    password === ""
                ) {
                    alert(
                        "Please fill in all required fields."
                    );
                    return;
                }
                /* =========================
                   GET USERS
                ========================== */
                let users = [];
                try {
                    users =
                        JSON.parse(
                            localStorage.getItem(
                                "luxuryJewelryUsers"
                            )
                        ) || [];
                } catch (error) {
                    console.error(
                        "Could not read users:",
                        error
                    );
                    users = [];
                }
                /* =========================
                   FIND USER
                ========================== */
                const user =
                    users.find(
                        registeredUser => {
                            if (
                                !registeredUser.email
                            ) {
                                return false;
                            }
                            return (
                                registeredUser.email
                                    .toLowerCase() ===
                                email
                                &&
                                registeredUser.password ===
                                password
                            );
                        }
                    );
                /* =====================================================
                   USER FOUND
                ===================================================== */
                if (user) {
                    /* =========================
                       SAVE CURRENT USER
                    ========================== */
                    localStorage.setItem(
                        "luxuryJewelryLoggedInUser",
                        JSON.stringify(user)
                    );
                    /* =========================
                       REMEMBER ME
                    ========================== */
                    const rememberMe =
                        document.getElementById(
                            "rememberMe"
                        );
                    if (
                        rememberMe &&
                        rememberMe.checked
                    ) {
                        localStorage.setItem(
                            "luxuryJewelryRememberMe",
                            "true"
                        );
                    } else {
                        localStorage.removeItem(
                            "luxuryJewelryRememberMe"
                        );
                    }
                    /* =========================
                       SUCCESS
                    ========================== */
                    alert(
                        `Login successful! Welcome back, ${user.fullName}.`
                    );
                    /* =========================
                       GO TO HOME
                    ========================== */
                    window.location.href =
                        "index.html";
                } else {
                    /* =========================
                       LOGIN FAILED
                    ========================== */
                    alert(
                        "Invalid email or password. Please try again."
                    );
                }
            }
        );
    }
    /* =====================================================
       FORGOT PASSWORD
    ===================================================== */
    if (forgotPassword) {
        forgotPassword.addEventListener(
            "click",
            (event) => {
                event.preventDefault();
                alert(
                    "Password reset functionality will be available soon."
                );
            }
        );
    }
    /* =====================================================
       CART COUNT
    ===================================================== */
    function updateCartCount() {
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
        let totalItems = 0;
        cart.forEach(item => {
            totalItems +=
                Number(
                    item.quantity
                ) || 1;
        });
        cartCountElements.forEach(
            element => {
                element.textContent =
                    totalItems;
            }
        );
    }
    updateCartCount();
    /* =====================================================
       ESCAPE KEY
    ===================================================== */
    document.addEventListener(
        "keydown",
        (event) => {
            if (
                event.key !==
                "Escape"
            ) {
                return;
            }
            /* CLOSE SEARCH */
            if (searchBox) {
                searchBox.classList.remove(
                    "active"
                );
            }
            /* CLOSE MOBILE MENU */
            if (navLinks) {
                navLinks.classList.remove(
                    "active"
                );
            }
            if (menuToggle) {
                menuToggle.classList.remove(
                    "active"
                );
            }
        }
    );
});