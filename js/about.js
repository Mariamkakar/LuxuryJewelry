/* =====================================================
   LUXURY JEWELRY
   ABOUT PAGE JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ================================================================================
       SCROLL REVEAL ANIMATION
       Shows the About page sections with an animation as they appear while scrolling.
    ============================================================================ */

    const revealElements = document.querySelectorAll(
        ".about-intro, .about-story, .about-values, .about-value-card, .about-cta"
    );

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.15
        }
    );


    revealElements.forEach(element => {

        element.classList.add("reveal");

        revealObserver.observe(element);

    });


    /* =================================================================
       SMOOTH SCROLL
       In this section handles internal link clicks and  enables smooth 
       scrolling to sections when internal links are clicked.
    ============================================================== */

    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (targetId === "#") return;

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



    /* =============================================================================
       ABOUT IMAGE HOVER EFFECT
       So, Adds a zoom effect to About page images when the mouse hovers over them.
    ==========================================================================*/

    const aboutImages = document.querySelectorAll(
        ".about-story img, .about-image img, .about-section img"
    );

    aboutImages.forEach(image => {

        image.addEventListener("mouseenter", () => {
            image.style.transform = "scale(1.03)";
        });

        image.addEventListener("mouseleave", () => {
            image.style.transform = "scale(1)";
        });

    });



    /* =================================
       CURRENT YEAR
       This section explin about footer
    =============================== */

    const yearElement = document.querySelector(".footer-bottom p");

    if (yearElement) {

        const currentYear = new Date().getFullYear();

        yearElement.innerHTML =
            `©️ ${currentYear} Bibi Mariam Abdul Shukoor.`;

    }

});