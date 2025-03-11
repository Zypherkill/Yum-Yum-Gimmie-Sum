

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
        cart.push({ ...item, quantity: 1 });
    }

    saveCart(cart);
    updateCart();
}

// ta bort från varukorg
export function removeFromCart(itemId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== itemId);

    saveCart(cart);
    updateCart();
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




