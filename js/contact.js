/* =====================================================
   LUXURY JEWELRY
   CONTACT PAGE JAVASCRIPT
===================================================== */

/* WAIT FOR THE HTML PAGE TO LOAD */

document.addEventListener("DOMContentLoaded", function () {
    console.log("CONTACT JS IS WORKING");

    /*fond FORM ELEMENT AND MESSAGE ELEMENT*/

    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    /*CHECK IF CONTACT FROM EXISTS*/
    if (!contactForm) {
        return;
    }

/*ADD EVENT LESTENER TO THE FROM SUBMIT EVENT*/

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();
       
/*GET USER INPUT VALUE*/

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

/*CHECK REQUIRED FILDS*/

        if (!name || !email || !subject || !message) {

            formMessage.style.display = "block";
            formMessage.style.color = "#b3261e";

            formMessage.textContent =
                "Please fill in all fields.";

            return;
        }

/*CHECK EMAIL VALIDATION*/

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email)) {

            formMessage.style.display = "block";
            formMessage.style.color = "#b3261e";

            formMessage.textContent =
                "Please enter a valid email address.";

            return;
        }

/*STORE CONTACT MESSGE IN LOCAL STORAGE*/
        const contactMessage = {
            name: name,
            email: email,
            subject: subject,
            message: message,
            date: new Date().toLocaleString()
        };
/*SAVECONTACT MESSAGE IN LOCAL STRORAGE*/

        localStorage.setItem(
            "luxuryJewelryContactMessage",
            JSON.stringify(contactMessage)
        );

/*DESPLYS SUCCESS MESSAGE*/
        formMessage.style.display = "block";
        formMessage.style.color = "#8a6a2f";

        formMessage.textContent =
            "Thank you! Your message has been received successfully.";

/*CLEAR CONTACT FORM INPUTS*/
        contactForm.reset();

    });

});