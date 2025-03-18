import { showMenu } from "./modules/menu.js";
import { placeOrder } from "./modules/delivery.js";
import { showNavigation } from "../utils/hamburgermenu.js";
import { displayReceipt } from "./modules/receipt.js";
import { validateRegistration, validateLogin } from "./modules/userHandling.js";
import { showLocation } from "./modules/location.js";
import { showOrderHistory } from "./modules/orderHistory.js";
import { logoutUser } from "./modules/userHandling.js";

if (!window.location.pathname.includes("/pages/bestallning.html") ) {
    logoutUser();
    showNavigation();
}

if (window.location.pathname.includes("/pages/bestallning.html")) {
    placeOrder();
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
if (window.location.pathname.includes("/pages/location.html")) {
    showLocation();
}
if (window.location.pathname.includes("/pages/orderhistorik.html")) {
    showOrderHistory();
}
