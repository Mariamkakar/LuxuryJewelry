/* =====================================================
   LUXURY JEWELRY
   SIGN UP JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       ELEMENTS
    ========================== */

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
    const confirmPasswordInput =
        document.getElementById("confirmPassword");

    const togglePassword =
        document.getElementById("togglePassword");

    const toggleConfirmPassword =
        document.getElementById("toggleConfirmPassword");

    const profileImageInput =
        document.getElementById("profileImage");

    const cartCountElements =
        document.querySelectorAll(".cart-count");


    /* =====================================================
       DARK MODE
    ===================================================== */

    const savedTheme =
        localStorage.getItem("luxuryJewelryTheme");

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


    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            body.classList.toggle("dark-mode");

            const isDark =
                body.classList.contains("dark-mode");

            localStorage.setItem(
                "luxuryJewelryTheme",
                isDark ? "dark" : "light"
            );

            themeToggle.textContent =
                isDark ? "☀" : "☾";

        });

    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

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


    /* =====================================================
       SEARCH
    ===================================================== */

    if (searchBtn && searchBox) {

        searchBtn.addEventListener("click", () => {

            searchBox.classList.add("active");

            if (homeSearch) {
                homeSearch.focus();
            }

        });

    }


    if (closeSearch && searchBox) {

        closeSearch.addEventListener("click", () => {

            searchBox.classList.remove("active");

        });

    }


    if (homeSearch) {

        homeSearch.addEventListener("keydown", (event) => {

            if (event.key === "Enter") {

                const searchValue =
                    homeSearch.value.trim();

                if (searchValue !== "") {

                    window.location.href =
                        `shop.html?search=${encodeURIComponent(
                            searchValue
                        )}`;

                }

            }

        });

    }


    /* =====================================================
       SHOW / HIDE PASSWORD
    ===================================================== */

    function setupPasswordToggle(button, input) {

        if (button && input) {

            button.addEventListener("click", () => {

                if (input.type === "password") {

                    input.type = "text";
                    button.textContent = "Hide";

                } else {

                    input.type = "password";
                    button.textContent = "Show";

                }

            });

        }

    }

    setupPasswordToggle(
        togglePassword,
        passwordInput
    );

    setupPasswordToggle(
        toggleConfirmPassword,
        confirmPasswordInput
    );


    /* =====================================================
       SIGNUP FORM
    ===================================================== */

    if (signupForm) {

        signupForm.addEventListener("submit", (event) => {

            event.preventDefault();


            /* =========================
               GET USER INFORMATION
            ========================== */

            const fullName =
                document
                    .getElementById("fullName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                passwordInput.value.trim();


            const confirmPassword =
                confirmPasswordInput.value.trim();


            /* =====================================================
               VALIDATE NAME
            ===================================================== */

            if (fullName.length < 2) {

                alert("Please enter your full name.");

                return;

            }


            /* =====================================================
               VALIDATE PASSWORD
            ===================================================== */

            if (password.length < 6) {

                alert(
                    "Password must be at least 6 characters long."
                );

                return;

            }


            /* =====================================================
               CONFIRM PASSWORD
            ===================================================== */

            if (password !== confirmPassword) {

                alert("Passwords do not match.");

                return;

            }


            /* =====================================================
               GET EXISTING USERS
            ===================================================== */

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


            /* =====================================================
               CHECK DUPLICATE EMAIL
            ===================================================== */

            const existingUser =
                users.find(
                    user =>
                        user.email &&
                        user.email.toLowerCase() === email
                );


            if (existingUser) {

                alert(
                    "An account with this email already exists."
                );

                return;

            }


            /* =====================================================
               PROFILE PHOTO
            ===================================================== */

            const file =
                profileImageInput
                    ? profileImageInput.files[0]
                    : null;


            /*
               If the user selects a photo,
               convert it to Base64 so it can be
               stored in localStorage.
            */

            if (file) {

                const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/webp",
                    "image/gif"
                ];


                if (!allowedTypes.includes(file.type)) {

                    alert(
                        "Please choose a JPG, PNG, WEBP or GIF image."
                    );

                    return;

                }


                /*
                   Keep image size reasonable because
                   localStorage has limited storage.
                */

                if (file.size > 2 * 1024 * 1024) {

                    alert(
                        "Please choose a profile photo smaller than 2 MB."
                    );

                    return;

                }

            }


            /* =====================================================
               FUNCTION TO CREATE USER
            ===================================================== */

            const createUser = (profileImage) => {

                const newUser = {

                    id: Date.now(),

                    fullName: fullName,

                    email: email,

                    password: password,

                    profileImage:
                        profileImage || "",

                    createdAt:
                        new Date().toISOString()

                };


                /* =========================
                   SAVE USER
                ========================== */

                users.push(newUser);

                localStorage.setItem(
                    "luxuryJewelryUsers",
                    JSON.stringify(users)
                );


                /* =========================
                   SUCCESS MESSAGE
                ========================== */

                alert(
                    "Account created successfully! You can now login."
                );


                /* =========================
                   GO TO LOGIN
                ========================== */

                window.location.href =
                    "login.html";

            };


            /* =====================================================
               SAVE PHOTO
            ===================================================== */

            if (file) {

                const reader =
                    new FileReader();


                reader.onload = function () {

                    createUser(
                        reader.result
                    );

                };


                reader.onerror = function () {

                    alert(
                        "There was a problem reading the profile photo."
                    );

                };


                reader.readAsDataURL(file);

            } else {

                /*
                   No photo selected.
                   User account is still created.
                */

                createUser("");

            }

        });

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
                Number(item.quantity) || 1;

        });


        cartCountElements.forEach(element => {

            element.textContent =
                totalItems;

        });

    }


    updateCartCount();


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            if (searchBox) {

                searchBox.classList.remove("active");

            }


            if (navLinks) {

                navLinks.classList.remove("active");

            }


            if (menuToggle) {

                menuToggle.classList.remove("active");

            }

        }

    });

});