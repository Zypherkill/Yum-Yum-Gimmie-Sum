import { getProducts } from "./api.js";
import { getCart, removeFromCart, updateCart, addToCart } from "./cart.js";
import { globalEventListener } from "../../utils/globalEventListener.js";

export async function showMenu() {
    console.log("showMenu called");

    const productData = await getProducts();
    console.log("productData:", productData);

    const wrapperRef = document.querySelector(".menu-wrapper");
    wrapperRef.innerHTML = "";

    // Skapar en sektion som håller texten "Meny" samt en ikon för att filtrera
    const headerRef = document.createElement("section");
    headerRef.classList.add("menu-header");

    const headerText = document.createElement("h1");
    headerText.textContent = "Meny";

    // const filterIcon = document.createElement("i");
    // filterIcon.classList.add("fa-solid", "fa-filter");

    headerRef.appendChild(headerText);
    // headerRef.appendChild(filterIcon);
    wrapperRef.appendChild(headerRef);

    // Skapar dropdown-menyn för filtrering
    const filterSelect = document.createElement("select");
    filterSelect.classList.add("filter-dropdown");
    // filterSelect.style.display = "none";
    filterSelect.addEventListener("change", (event) => {
        filterMenu(event.target.value);
    });

    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = "Filter all";
    filterSelect.appendChild(allOption);

    const types = [...new Set(productData.map((item) => item.type))];
    types.forEach((type) => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = `Filter ${type}`;
        filterSelect.appendChild(option);
    });

    wrapperRef.appendChild(filterSelect);

    // Eventlyssnare på filterikonen för att visa/gömma dropdown-menyn
    // filterIcon.addEventListener("click", () => {
    //     filterSelect.style.display =
    //         filterSelect.style.display === "none" ? "block" : "none";
    // });

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
}

globalEventListener.add("click", ".fa-solid.fa-cart-shopping", () => {
    updateCart(); // Uppdaterar innan vi visar modalen
    document.getElementById("cart-modal").classList.remove("hidden");
});


// Kallar showMenu när DOMen har laddat
globalEventListener.add("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event fired");
    showMenu();
});
// Handle item addition to the cart
globalEventListener.add("click", ".fa-circle-plus", async (event, button) => {
    const itemId = Number(button.getAttribute("data-id"));
    const availableItems = await getProducts(); 
    const selectedItem = availableItems.find(product => product.id === itemId);
    
    if (!selectedItem) return;

    addToCart(selectedItem);
    updateCart();

    // Locate the menu item in the DOM
    const parentItem = button.closest(".menu-item");
    const nameElement = parentItem.querySelector(".menu-title");

    // Retrieve the latest quantity from storage
    const currentCart = getCart();
    const itemInCart = currentCart.find(product => product.id === itemId);
    const newQuantity = itemInCart ? itemInCart.quantity : 1;

    // Update the display
    nameElement.textContent = `${selectedItem.name} x ${newQuantity}`;
});

// Handle item removal from the cart
globalEventListener.add("click", ".fa-circle-minus", (event, button) => {
    const itemId = Number(button.getAttribute("data-id"));
    removeFromCart(itemId);
    updateCart();

    // Find the related menu entry
    const parentItem = button.closest(".menu-item");
    const nameElement = parentItem.querySelector(".menu-title");

    // Get the updated cart data
    const updatedCart = getCart();
    const itemInCart = updatedCart.find(product => product.id === itemId);
    const newQuantity = itemInCart ? itemInCart.quantity : 0;

    // Adjust the item label based on quantity
    nameElement.textContent = newQuantity > 0 
        ? `${itemInCart.name} x ${newQuantity}` 
        : itemInCart.name;
});


document.querySelector(".menu-wrapper")?.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-cart")) {
        const itemId = parseInt(event.target.getAttribute("data-id"));

        // 🔥 Hämta rätt produkt från `productData`, INTE från varukorgen!
        const item = productData.find(product => product.id === itemId);
        if (!item) {
            console.error("🚨 Produkt med ID", itemId, "hittades inte i productData!");
            return;
        }

        addToCart(item); // Lägg till i varukorgen
        updateCart(); // Uppdatera gränssnittet
    }
});
const cartIcon = document.querySelector(".cart-icon");
const cartDropdown = document.getElementById("cart-dropdown");

cartIcon.addEventListener("mouseenter", () => {
    updateCartDropdown();
    cartDropdown.classList.add("show");
});

cartIcon.addEventListener("mouseleave", () => {
    setTimeout(() => {
        cartDropdown.classList.remove("show");
    }, 300); // Delay hiding to allow hovering over the dropdown
});

cartDropdown.addEventListener("mouseenter", () => {
    cartDropdown.classList.add("show"); // Keep visible when hovered
});

cartDropdown.addEventListener("mouseleave", () => {
    cartDropdown.classList.remove("show"); // Hide when leaving
});

// Function to update the dropdown content
function updateCartDropdown() {
    const cart = getCart();
    cartDropdown.innerHTML = cart.length > 0 
        ? cart.map(item => `<p>${item.name} x ${item.quantity}</p>`).join("")
        : "<p>Din varukorg är tom.</p>";
}