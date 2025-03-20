import { showMenu } from "./modules/menu.js";
import { placeOrder } from "./modules/delivery.js";
import { showNavigation } from "../utils/hamburgermenu.js";
import { displayReceipt } from "./modules/receipt.js";
import { showAdminPanel } from "./modules/adminPanel.js";
import { validateRegistration, validateLogin, displayUserProfile, updateUserProfile, logoutUser } from "./modules/userHandling.js";
import { showLocation } from "./modules/location.js";
import { showOrderHistory } from "./modules/orderHistory.js";

if (!window.location.pathname.includes("/pages/bestallning.html")) {
    logoutUser();
}

if (window.location.pathname.includes("/pages/meny.html")) {
    showMenu();
}

if (window.location.pathname.includes("/pages/register.html")) {
    validateRegistration();
}

if (window.location.pathname.includes("/pages/login.html")) {
    validateLogin();
}

if (window.location.pathname.includes("/pages/adminPanel.html")) {
    showAdminPanel();
}

if (window.location.pathname.includes("/pages/location.html")) {
    showLocation();
}

if (window.location.pathname.includes("/pages/orderhistorik.html")) {
    showOrderHistory();
}

if (window.location.pathname.includes("/pages/bestallning.html")) {
    placeOrder();
    displayReceipt();
}

if (window.location.pathname.includes("/pages/profil.html")) {
    displayUserProfile();
    document.addEventListener("DOMContentLoaded", () => {
        const updateBtn = document.querySelector(".update-profile-btn");
        if (updateBtn) {
            updateBtn.addEventListener("click", updateUserProfile);
        } else {
            console.error("Update Profile button not found!");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const receiptButton = document.getElementById("receipt-button");
    const closeButton = document.getElementById("close-overlay");
    const receiptOverlay = document.getElementById("receipt-overlay");

    // Lägger till lyssnare på knappen för att visa kvittot
    receiptButton.addEventListener("click", () => {
        // Visa dialogen (overlay)
        receiptOverlay.showModal();
        // Sätt aria-hidden till false när dialogen är öppen
        receiptOverlay.setAttribute("aria-hidden", "false");
    });

    // Lägger till lyssnare på stängningsknappen för att stänga dialogen
    closeButton.addEventListener("click", () => {
        // Stänger dialogen (overlay)
        receiptOverlay.close();
        // Sätt aria-hidden till true när dialogen är stängd
        receiptOverlay.setAttribute("aria-hidden", "true");
    });

    // Lägger till lyssnare på knappen för att göra en ny beställning
    document.querySelector("#new-order").addEventListener("click", () => {
        localStorage.removeItem("cart"); // Rensa cart i local storage
        localStorage.removeItem("lastOrder"); // Rensa lastOrder
        window.location.href = "meny.html"; // Navigera till menynsidan
    });
});


showNavigation();