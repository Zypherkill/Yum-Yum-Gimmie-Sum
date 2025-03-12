import { showMenu } from "./modules/menu.js";
import { placeOrder } from "./modules/delivery.js";
import { showNavigation } from "../utils/hamburgermenu.js";

if (window.location.pathname === "/pages/bestallning.html") {
    placeOrder();
}
showMenu();
showNavigation();
