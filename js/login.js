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
    /* LOAD SAVED THEME */
    const savedTheme = localStorage.getItem("luxuryJewelryTheme");
    if (savedTheme === "dark") {
        body.classList.add("dark-mode");
        if (themeToggle) {
            themeToggle.textContent = "☀";
        }
    } else {
        body.classList.remove("dark-mode");
        if (themeToggle) {
            themeToggle.textContent = "☾";
        }
    }
    /* TOGGLE DARK AND LIGHT MODE */
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
            if (homeSearch) {
                homeSearch.focus();
            }
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
            if (event.key !== "Enter") {
                return;
            }
            const searchValue = homeSearch.value.trim();
            if (searchValue !== "") {
                window.location.href =
                    "shop.html?search=" +
                    encodeURIComponent(searchValue);
            }
        });
    }
    /* SHOW OR HIDE PASSWORD */
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                togglePassword.textContent = "Hide";
            } else {
                passwordInput.type = "password";
                togglePassword.textContent = "Show";
            }
        });
    }
    /* LOGIN */
    if (loginForm) {
        loginForm.addEventListener("submit", event => {
            event.preventDefault();
            const emailInput = document.getElementById("email");
            const email = emailInput
                ? emailInput.value.trim().toLowerCase()
                : "";
            const password = passwordInput
                ? passwordInput.value.trim()
                : "";
            /* VALIDATE INPUT */
            if (email === "" || password === "") {
                alert("Please fill in all required fields.");
                return;
            }
            /* GET REGISTERED USERS */
            let users = [];
            try {
                users = JSON.parse(
                    localStorage.getItem("luxuryJewelryUsers")
                ) || [];
            } catch (error) {
                console.error("Could not read registered users:", error);
                users = [];
            }
            /* FIND MATCHING USER */
            const user = users.find(registeredUser => {
                if (!registeredUser.email) {
                    return false;
                }
                return (
                    registeredUser.email.toLowerCase() === email &&
                    registeredUser.password === password
                );
            });
            /* CHECK LOGIN DETAILS */
            if (!user) {
                alert("Invalid email or password. Please try again.");
                return;
            }
            /* SAVE LOGGED-IN USER */
            try {
                localStorage.setItem(
                    "luxuryJewelryLoggedInUser",
                    JSON.stringify(user)
                );
            } catch (error) {
                console.error("Could not save login information:", error);
                alert("Unable to complete login. Please try again.");
                return;
            }
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
        });
    }
    /* FORGOT PASSWORD */
    if (forgotPassword) {
        forgotPassword.addEventListener("click", event => {
            event.preventDefault();
            alert("Password reset functionality will be available soon.");
        });
    }
    /* UPDATE CART COUNT */
    function updateCartCount() {
        let cart = [];
        try {
            cart = JSON.parse(
                localStorage.getItem("luxuryJewelryCart")
            ) || [];
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
        if (event.key !== "Escape") {
            return;
        }
        if (searchBox) {
            searchBox.classList.remove("active");
        }
        if (navLinks) {
            navLinks.classList.remove("active");
        }
        if (menuToggle) {
            menuToggle.classList.remove("active");
        }
    });
});