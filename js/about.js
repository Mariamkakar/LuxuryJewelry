/* =====================================================
   LUXURY JEWELRY
   ABOUT PAGE JAVASCRIPT
   Reviews, feedback, profile photo, and notifications
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       SCROLL REVEAL ANIMATION
    ===================================================== */

    const revealElements = document.querySelectorAll(
        ".about-intro, .about-story, .about-values, .about-value-card, .about-cta"
    );

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        revealElements.forEach(element => {
            element.classList.add("reveal");
            revealObserver.observe(element);
        });
    }

    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {

                event.preventDefault();

                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });

    /* =====================================================
       ABOUT IMAGE HOVER EFFECT
    ===================================================== */

    document.querySelectorAll(
        ".about-story img, .about-image img, .about-section img"
    ).forEach(image => {
        image.addEventListener("mouseenter", () => {
            image.style.transform = "scale(1.03)";
        });

        image.addEventListener("mouseleave", () => {
            image.style.transform = "scale(1)";
        });
        
    });

    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    const yearElement = document.querySelector(".footer-bottom p");

    if (yearElement) {
        yearElement.textContent =
            `© ${new Date().getFullYear()} Bibi Mariam Abdul Shukoor.`;
    }

    /* =====================================================
       FEEDBACK FORM ELEMENTS
    ===================================================== */

    const feedbackForm = document.querySelector(".about-feedback-form");
    const reviewCards = document.querySelector(".review-cards");

    if (!feedbackForm || !reviewCards) {
        console.error("Feedback form or review cards were not found.");
        return;
    }

    const fields = feedbackForm.querySelectorAll("input, select, textarea");

    const nameInput = fields[0];
    const emailInput = fields[1];
    const categoryInput = fields[2];
    const ratingInput = fields[3];
    const messageInput = fields[4];
    const termsInput = fields[5];

    const REVIEWS_KEY = "luxuryJewelryCustomerReviews";

    /* =====================================================
        READ AND SAVE REVIEWS
    ===================================================== */

    function readReviews() {
        try {
            const saved = localStorage.getItem(REVIEWS_KEY);
            const reviews = saved ? JSON.parse(saved) : [];

            return Array.isArray(reviews) ? reviews : [];
        } catch (error) {
            console.error("Could not read customer reviews:", error);
            return [];
        }
    }

    function saveReviews(reviews) {
        try {
            localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
            return true;
        } catch (error) {
            console.error("Could not save customer reviews:", error);

            showFeedbackMessage(
                "Your review could not be saved. Please check browser storage.",
                false
            );

            return false;
        }
    }

    /* =====================================================
       GET LOGGED-IN CUSTOMER PROFILE
    ===================================================== */

    function getCurrentProfile() {
        try {
            const loggedInUser = JSON.parse(
                localStorage.getItem("luxuryJewelryLoggedInUser") || "null"
            );

            if (!loggedInUser) return null;

            const identifier =
                loggedInUser.id ||
                loggedInUser.userId ||
                loggedInUser.email;

            if (!identifier) return null;

            const userKey = String(identifier)
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9_-]/g, "_");

            const profileKey = "luxuryJewelryProfile_" + userKey;

            const profile = JSON.parse(
                localStorage.getItem(profileKey) || "{}"
            );

            return {
                name:
                    profile.fullName ||
                    loggedInUser.fullName ||
                    loggedInUser.name ||
                    loggedInUser.username ||
                    "",
                email: profile.email || loggedInUser.email || "",
                photo: profile.photo || ""
            };
        } catch (error) {
            console.error("Could not load profile information:", error);
            return null;
        }
    }

    /* =====================================================
       SUCCESS AND ERROR NOTIFICATION
    ===================================================== */

    function showFeedbackMessage(message, success = true) {
        let notification = document.getElementById("feedbackNotification");

        if (!notification) {
            notification = document.createElement("div");
            notification.id = "feedbackNotification";

            Object.assign(notification.style, {
                position: "fixed",
                top: "25px",
                right: "25px",
                zIndex: "99999",
                maxWidth: "min(400px, calc(100vw - 40px))",
                padding: "16px 22px",
                borderRadius: "10px",
                border: "1px solid",
                boxShadow: "0 5px 20px rgba(0,0,0,0.12)",
                fontFamily: "Poppins, sans-serif",
                fontSize: "14px",
                lineHeight: "1.6",
                opacity: "0",
                transform: "translateY(-10px)",
                transition: "opacity 0.25s ease, transform 0.25s ease"
            });

            document.body.appendChild(notification);
        }

        notification.textContent = message;
        notification.style.background = success ? "#f5ead0" : "#fff0ed";
        notification.style.color = success ? "#654b20" : "#922b21";
        notification.style.borderColor = success ? "#c99a3b" : "#d88b80";
        notification.style.opacity = "1";
        notification.style.transform = "translateY(0)";

        if (notification.hideTimer) {
            clearTimeout(notification.hideTimer);
        }

        notification.hideTimer = setTimeout(() => {
            notification.style.opacity = "0";
            notification.style.transform = "translateY(-10px)";
        }, 3500);
    }

    /* =====================================================
        CUSTOMER INITIALS
    ===================================================== */

    function getInitials(name) {
        return String(name || "Customer")
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(part => part.charAt(0).toUpperCase())
            .join("") || "C";
    }

    /* =====================================================
          FEEDBACK CATEGORY LABELS
    ===================================================== */

    function getCategoryDetails(category) {
        const details = {
            product: {
                name: "Product Feedback",
                collection: "Jewelry Products"
            },
            collection: {
                name: "Collection Feedback",
                collection: "Jewelry Collection"
            },
            price: {
                name: "Price Feedback",
                collection: "Pricing"
            },
            service: {
                name: "Customer Service",
                collection: "Customer Experience"
            },
            shipping: {
                name: "Shipping Experience",
                collection: "Delivery"
            }
        };

        return details[category] || {
            name: "Customer Feedback",
            collection: "Luxury Jewelry"
        };
    }

    /* =====================================================
       CREATE CUSTOMER REVIEW CARD
    ===================================================== */

    function createReviewCard(review) {
        const card = document.createElement("article");
        card.className = "review-card";

        // Customer information
        const user = document.createElement("div");
        user.className = "review-user";

        const avatar = document.createElement("div");
        avatar.className = "review-avatar";

        if (review.photo) {
            const image = document.createElement("img");

            image.src = review.photo;
            image.alt = "Customer profile photo";

            Object.assign(image.style, {
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%"
            });

            image.addEventListener("error", () => {
                image.remove();
                avatar.textContent = getInitials(review.name);
            }, { once: true });

            avatar.appendChild(image);
        } else {
            avatar.textContent = getInitials(review.name);
        }

        const userDetails = document.createElement("div");

        const userName = document.createElement("h4");
        userName.textContent = review.name || "Customer";

        const date = document.createElement("span");
        date.textContent = review.date || "Customer review";

        userDetails.append(userName, date);
        user.append(avatar, userDetails);

        // Rating stars
        const stars = document.createElement("div");
        stars.className = "review-stars";

        const rating = Math.max(
            1,
            Math.min(5, Number(review.rating) || 1)
        );

        stars.textContent =
            "★".repeat(rating) + "☆".repeat(5 - rating);

        stars.setAttribute("aria-label", `${rating} out of 5 stars`);

        // Customer message
        const reviewText = document.createElement("p");
        reviewText.className = "review-text";
        reviewText.textContent = `“${review.message || ""}”`;

        // Feedback category
        const product = document.createElement("div");
        product.className = "review-product";

        const productIcon = document.createElement("div");
        productIcon.className = "product-icon";
        productIcon.textContent = "◇";

        const productDetails = document.createElement("div");

        const productName = document.createElement("strong");
        productName.textContent =
            review.productName || "Customer Feedback";

        const collection = document.createElement("span");
        collection.textContent =
            review.collection || "Luxury Jewelry";

        productDetails.append(productName, collection);
        product.append(productIcon, productDetails);

        card.append(user, stars, reviewText, product);

        return card;
    }

    /* =====================================================
       DISPLAY ONLY SAVED CUSTOMER REVIEWS
       Remove sample cards and sort newest first.
    ===================================================== */

    function displaySavedReviews() {
        const reviews = readReviews();

        // Remove sample cards and previous rendered cards.
        reviewCards.replaceChildren();

        // Sort customer reviews from newest to oldest.
        reviews
            .slice()
            .sort((a, b) => {
                return new Date(b.createdAt || 0) -
                       new Date(a.createdAt || 0);
            })
            .forEach(review => {
                const card = createReviewCard(review);
                card.dataset.customerReview = "true";
                reviewCards.appendChild(card);
            });
    }

    // Display saved reviews when the page opens.
    displaySavedReviews();

    /* =====================================================
       SUBMIT CUSTOMER FEEDBACK
    ===================================================== */

    feedbackForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const category = categoryInput.value;
        const rating = Number(ratingInput.value);
        const message = messageInput.value.trim();

        if (
            !name ||
            !email ||
            !category ||
            !rating ||
            !message ||
            !termsInput.checked
        ) {
            showFeedbackMessage(
                "Please complete all fields and agree to the terms.",
                false
            );
            return;
        }

        if (!emailInput.validity.valid) {
            showFeedbackMessage(
                "Please enter a valid email address.",
                false
            );
            return;
        }

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            showFeedbackMessage(
                "Please select a valid rating.",
                false
            );
            return;
        }

        const profile = getCurrentProfile();

        const reviewerName =
            profile && profile.name ? profile.name : name;

        const reviewerPhoto = profile ? profile.photo : "";

        const categoryDetails = getCategoryDetails(category);

        const newReview = {
            id: Date.now().toString(),
            name: reviewerName,
            email: email,
            photo: reviewerPhoto,
            category: category,
            rating: rating,
            message: message,
            productName: categoryDetails.name,
            collection: categoryDetails.collection,
            date: "Just now",
            createdAt: new Date().toISOString()
        };

        const reviews = readReviews();
        reviews.push(newReview);

        // Save the review before displaying it.
        if (!saveReviews(reviews)) return;

        // Refresh cards in newest-first order.
        displaySavedReviews();

        // Clear the form after successful submission.
        feedbackForm.reset();

        showFeedbackMessage(
            "Thank you! Your review has been submitted successfully.",
            true
        );

        // Scroll to the newest review.
        const newestCard = reviewCards.firstElementChild;

        if (newestCard) {
            newestCard.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }
    });

    /* =====================================================
       REFRESH REVIEWS FROM OTHER BROWSER TABS
    ===================================================== */

    window.addEventListener("storage", event => {
        if (event.key === REVIEWS_KEY) {
            displaySavedReviews();
        }
    });

});