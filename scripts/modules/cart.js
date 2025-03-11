

// hämta varukorg
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// spara varukorg
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// lägg till i varukorg
export function addToCart(item) {
    let cart = getCart();
    let existingItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity : 1 });
    }

    saveCart(cart);
    updateCart();
}

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

function renderMenu(menuItems) {
    const menuContainer = document.getElementById("menu");
    menuContainer.innerHTML = menuItems.map(item => `
        <div class="menu-item">
            <h3>${item.name}</h3>
            <p>Pris: ${item.price} kr</p>
            <button class="add-to-cart" data-id="${item.id}">Lägg till</button>
        </div>
    `).join("");
}

// Uppdatera varukorgen
function updateCart() {
    const cartContainer = document.getElementById("cart");
    if (!cartContainer) return;

    const cart = getCart();
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <h4>${item.name} x ${item.quantity}</h4>
            <p>${item.price * item.quantity} kr</p>
            <button class="remove-from-cart" data-id="${item.id}">Ta bort</button>
        </div>
    `).join("");


}

document.addEventListener("DOMContentLoaded", async () => {
    
    if (document.getElementById("cart-container")) {
        const menuItems = await getProducts();
        renderMenu(menuItems);
    }
    if (document.getElementById("cart")) {
        updateCart();
    }
});
