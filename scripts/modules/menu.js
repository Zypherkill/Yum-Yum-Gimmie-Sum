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
            itemPrice.textContent = `${item.price} kr`;
            itemPrice.classList.add("menu-price");
    
            const plusButton = document.createElement("i");
            plusButton.classList.add("fa-solid", "fa-circle-plus");
            plusButton.setAttribute("data-id", item.id);
            plusButton.setAttribute("tabindex", "0"); // Make it focusable
            plusButton.addEventListener("keydown", handleKeydown); // Handle Enter/Space press
    
            const minusButton = document.createElement("i");
            minusButton.classList.add("fa-solid", "fa-circle-minus");
            minusButton.setAttribute("data-id", item.id);
            minusButton.setAttribute("tabindex", "0"); // Make it focusable
            minusButton.addEventListener("keydown", handleKeydown); // Handle Enter/Space press
    
            // Append plusButton first, then minusButton
            menuItem.appendChild(itemName);
            menuItem.appendChild(itemIngredients);
            menuItem.appendChild(itemPrice);
            menuItem.appendChild(plusButton); // Plus button comes first in the tab order
            menuItem.appendChild(minusButton); // Minus button comes after the plus button
            menuRef.appendChild(menuItem);
        });
    }
    
    function handleKeydown(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault(); // Prevent default behavior for Space (scrolling)
            event.target.click();  // Trigger click event on the target element
        }
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

globalEventListener.add("click", ".fa-cart-shopping", () => {
    updateCart(); // Uppdaterar innan vi visar modalen
    document.getElementById("cart-modal").classList.remove("hidden");
});


// Kallar showMenu när DOMen har laddat
globalEventListener.add("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event fired");
    showMenu();
});

//handle item addition to the cart
globalEventListener.add("click", ".fa-circle-plus", async (event, button) => {
    const itemId = Number(button.getAttribute("data-id"));
    const availableItems = await getProducts();
    const selectedItem = availableItems.find(product => product.id === itemId);

    if (!selectedItem) return;

    // Add to cart
    addToCart(selectedItem);

    // Update cart UI
    updateCart();

    // Find and update the menu item quantity
    const parentItem = document.querySelector(`.menu-item [data-id="${itemId}"]`)?.closest(".menu-item");
    if (parentItem) {
        const nameElement = parentItem.querySelector(".menu-title");

        // Retrieve updated cart data
        const currentCart = getCart();
        const itemInCart = currentCart.find(product => product.id === itemId);
        const newQuantity = itemInCart ? itemInCart.quantity : 1;

        // Update menu display to match the cart
        nameElement.textContent = `${selectedItem.name
            } x ${newQuantity}`;
    }
}
);


// Handle item removal from the cart
globalEventListener.add("click", ".fa-circle-minus", async (event, button) => {
    const itemId = Number(button.getAttribute("data-id"));
    const availableItems = await getProducts();
    const selectedItem = availableItems.find(product => product.id === itemId);

    // Remove item from cart
    removeFromCart(itemId);

    // Update cart UI
    updateCart();

    // Get the updated cart data
    const updatedCart = getCart();
    const itemInCart = updatedCart.find(product => product.id === itemId);
    const newQuantity = itemInCart ? itemInCart.quantity : 0;

    //Update the menu quantity text
    const parentItem = document.querySelector(`.menu-item [data-id="${itemId}"]`)?.closest(".menu-item");
    if (parentItem) {
        const nameElement = parentItem.querySelector(".menu-title");
        nameElement.textContent = newQuantity > 0
            ? `${selectedItem.name} x ${newQuantity}`
            : selectedItem.name;
    }
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

const cartDropdown = document.getElementById("cart-dropdown");

// Show dropdown on hover over cart icon
globalEventListener.add("mouseover", ".cart-icon", () => {
    updateCartDropdown();
    cartDropdown.classList.add("show");
});

// Hide dropdown with a slight delay
globalEventListener.add("mouseout", ".cart-icon", () => {
    setTimeout(() => {
        if (!cartDropdown.matches(":hover")) {
            cartDropdown.classList.remove("show");
        }
    }, 200); // Allow time to move to dropdown
});

// Keep dropdown visible when hovered over
globalEventListener.add("mouseover", "#cart-dropdown", () => {
    cartDropdown.classList.add("show");
});

// Hide dropdown when mouse leaves it
globalEventListener.add("mouseout", "#cart-dropdown", () => {
    cartDropdown.classList.remove("show");
});

// Function to update the dropdown content
function updateCartDropdown() {
    const cart = getCart();
    cartDropdown.innerHTML = cart.length > 0
        ? cart.map(item => `<p>${item.name} × ${item.quantity}</p>`).join("")
        : "<p>Din varukorg är tom.</p>";
}
