// Hämta varukorg
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Spara varukorg
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Lägg till i varukorg
export function addToCart(item) {
    let cart = getCart();
    let existingItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    saveCart(cart);
    updateCart();
}

// Ta bort från varukorg
export function removeFromCart(itemId) {
    let cart = getCart();
    let existingItem = cart.find(cartItem => cartItem.id === itemId);

    if (existingItem) {
        if (existingItem.quantity > 1) {
            existingItem.quantity -= 1;
        } else {
            cart = cart.filter(item => item.id !== itemId);
        }
    }

    saveCart(cart);
    updateCart();
}

// Rendera endast varukorgens produkter i menyn
function renderMenu() {
    const menuContainer = document.querySelector(".menu-wrapper");
    if (!menuContainer) return;

    const cartItems = getCart();

    menuContainer.innerHTML = cartItems.map(item => `
        <article class="menu-item">
            <h2 class="menu-title">${item.name} x ${item.quantity}</h2>
            <p class="menu-ingredients">${Array.isArray(item.ingredients) && item.ingredients.length > 0 ? item.ingredients.join(', ') : "Inga ingredienser"}</p>
            <p class="menu-price">${item.price * item.quantity} sek</p>
            <i class="fa-solid fa-circle-minus remove-from-cart" data-id="${item.id}"></i>
        </article>
    `).join("");
}

// Uppdatera varukorgen
function updateCart() {
    const cartContainer = document.getElementById("cart");
    if (!cartContainer) return;

    const cart = getCart();

    cartContainer.innerHTML = cart.map(item => `
        <article class="menu-item">
            <h2 class="menu-title">${item.name} x ${item.quantity}</h2>
            <p class="menu-ingredients">${Array.isArray(item.ingredients) && item.ingredients.length > 0 ? item.ingredients.join(', ') : "Inga ingredienser"}</p>
            <p class="menu-price">${item.price * item.quantity} sek</p>
            <i class="fa-solid fa-circle-minus remove-from-cart" data-id="${item.id}"></i>
        </article>
    `).join("");
}

// Lyssna på klick för att ta bort från varukorgen
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-from-cart")) {
        const itemId = parseInt(event.target.getAttribute("data-id"));
        removeFromCart(itemId);
        updateCart(); // Uppdatera både varukorgen och menyn
    }
});

// När sidan laddas, rendera menyn och varukorgen
document.addEventListener("DOMContentLoaded", () => {
    renderMenu(); // Visar endast produkter i varukorgen
    updateCart();
});
