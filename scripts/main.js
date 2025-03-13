import { showMenu } from "./modules/menu.js";
import { placeOrder } from "./modules/delivery.js";
import { showNavigation } from "../utils/hamburgermenu.js";
import { displayReceipt } from "./modules/receipt.js";

if (window.location.pathname === "/pages/bestallning.html") {
    placeOrder();
}

if (window.location.pathname === "/pages/meny.html") {
    showMenu();

}

showNavigation();

