import { getProducts } from "./api.js";
import { addToCart, removeFromCart } from "./cart.js";
import { globalEventListener } from "../../utils/globalEventListener.js";

export async function showMenu() {
    console.log("showMenu called");

    const productData = await getProducts();
    console.log("productData:", productData);

    const wrapperRef = document.querySelector(".menu-wrapper");
    wrapperRef.innerHTML = ""; // Clear the wrapper before appending new elements

    // Skapar en sektion som håller texten "Meny" samt en ikon för att filtrera
    const headerRef = document.createElement("section");
    headerRef.classList.add("menu-header");

    const headerText = document.createElement("h1");
    headerText.textContent = "Meny";

    const filterIcon = document.createElement("i");
    filterIcon.classList.add("fa-solid", "fa-filter");

    headerRef.appendChild(headerText);
    headerRef.appendChild(filterIcon);
    wrapperRef.appendChild(headerRef);

    // Skapar dropdown-menyn för filtrering
    const filterSelect = document.createElement("select");
    filterSelect.classList.add("filter-dropdown");
    filterSelect.style.display = "none";
    filterSelect.addEventListener("change", (event) => {
        filterMenu(event.target.value);
    });

    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = "All";
    filterSelect.appendChild(allOption);

    const types = [...new Set(productData.map((item) => item.type))];
    types.forEach((type) => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        filterSelect.appendChild(option);
    });

    wrapperRef.appendChild(filterSelect);

    // Eventlyssnare på filterikonen för att visa/gömma dropdown-menyn
    filterIcon.addEventListener("click", () => {
        filterSelect.style.display =
            filterSelect.style.display === "none" ? "block" : "none";
    });

    // Skapar menysektionen
    const menuRef = document.createElement("section");
    menuRef.classList.add("menu-items");
    wrapperRef.appendChild(menuRef);

    function renderMenu(items) {
        menuRef.innerHTML = ""; // Rensa tidigare meny
        items.forEach((item) => {
            const menuItem = document.createElement("article");
            menuItem.classList.add("menu-item");

            const itemName = document.createElement("h2");
            itemName.textContent = item.name;
            itemName.classList.add("menu-title");

            const itemIngredients = document.createElement("p");
            itemIngredients.textContent = Array.isArray(item.ingredients) && item.ingredients.length > 0
                ? item.ingredients.join(", ")
                : "";
            itemIngredients.classList.add("menu-ingredients");

            const itemPrice = document.createElement("p");
            itemPrice.textContent = `${item.price} sek`;
            itemPrice.classList.add("menu-price");

            const plusButton = document.createElement("i");
            plusButton.classList.add("fa-solid", "fa-circle-plus");
            plusButton.setAttribute("data-id", item.id);

            const minusButton = document.createElement("i");
            minusButton.classList.add("fa-solid", "fa-circle-minus");
            minusButton.setAttribute("data-id", item.id);

            menuItem.appendChild(itemName);
            menuItem.appendChild(itemIngredients);
            menuItem.appendChild(itemPrice);
            menuItem.appendChild(minusButton);
            menuItem.appendChild(plusButton);
            menuRef.appendChild(menuItem);
        });
    }

    renderMenu(productData);

    function filterMenu(type) {
        const filteredData = type
            ? productData.filter((item) => item.type === type)
            : productData;
        renderMenu(filteredData);
    }

    console.log("Menu items appended");

    // Add to cart
    globalEventListener.add("click", ".fa-circle-plus", async (event, button) => {
        const itemId = parseInt(button.getAttribute("data-id"));
        const menuItems = await getProducts();
        const item = menuItems.find((item) => item.id === itemId);
        if (item) {
            addToCart(item);
            alert("Added to cart! Item ID: " + itemId);
        }
    });

    // Remove from cart
    globalEventListener.add("click", ".fa-circle-minus", (event, button) => {
        const itemId = parseInt(button.getAttribute("data-id"));
        alert("Removed! Item ID: " + itemId);
        removeFromCart(itemId);
    });
}

globalEventListener.add("click", ".fa-solid.fa-cart-shopping", (event, button) => {
    window.location.href = "../pages/cart.html";
});

// Call showMenu when the DOM is fully loaded
globalEventListener.add("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event fired");
    showMenu();
});
