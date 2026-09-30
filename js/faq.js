/* =====================================================
   LUXURY JEWELRY
   FAQ JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {


    /* =================================================
       FAQ ACCORDION
    ================================================= */

    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach(function (question) {

        question.addEventListener("click", function () {

            const currentItem = question.closest(".faq-item");

            const isActive = currentItem.classList.contains("active");


            // Close all questions

            document.querySelectorAll(".faq-item").forEach(function (item) {
                item.classList.remove("active");
            });


            // Open selected question

            if (!isActive) {
                currentItem.classList.add("active");
            }

        });

    });



    /* =================================================
       FAQ CATEGORY FILTER
    ================================================= */

    const categoryButtons = document.querySelectorAll(".faq-category");

    const faqItems = document.querySelectorAll(".faq-item");


    categoryButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const selectedCategory = button.dataset.category;


            // Remove active from all buttons

            categoryButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });


            // Add active to selected button

            button.classList.add("active");


            // Filter questions

            faqItems.forEach(function (item) {

                const itemCategory = item.dataset.category;

                item.classList.remove("active");


                if (
                    selectedCategory === "all" ||
                    itemCategory === selectedCategory
                ) {

                    item.style.display = "block";

                } else {

                    item.style.display = "none";

                }

            });

        });

    });



    /* =================================================
       NEWSLETTER FORM
    ================================================= */

    const newsletterForm = document.querySelector(".newsletter-form");

    if (newsletterForm) {

        newsletterForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const emailInput = newsletterForm.querySelector("input");

            if (emailInput.value.trim() !== "") {

                alert("Thank you for subscribing to our newsletter!");

                emailInput.value = "";

            }

        });

    }



    /* =================================================
       CURRENT YEAR
    ================================================= */

    const footerYear = document.querySelector(".footer-bottom p");

    if (footerYear) {

        footerYear.innerHTML =
            `© ${new Date().getFullYear()} Luxury Jewelry. All Rights Reserved.`;

    }

});