// Fejkat API call för att hämta menyn
async function fetchMenuItems() {
    try {
        const response = await fetch('https://nikkis-api.com/menu-items'); //nikkis api är inte klar än O.o
        if (!response.ok) {
            throw new Error('Network error funka int dedär du.. ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Funka int!:', error);
    }
}
/* Exempel på nikkis api
[
        { id: 1, name: "Nikki's Super Borgir", price: 69 },
        { id: 2, name: "Nikki's Mega Noodles", price: 69 },
        { id: 3, name: "Nikki's Wonton Deluxe", price: 69 }
];
*/

// hämta varukorg
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// spara varukorg
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// lägg till i varukorg
function addToCart(item) {
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
function removeFromCart(itemId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== itemId);

    saveCart(cart);
    updateCart();
}

// Rendera menyn (utan event listeners) implementera på måndag..
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

    // Lägg till event listeners för ta bort-knapparna
    document.querySelectorAll(".remove-from-cart").forEach(button => {
        button.addEventListener("click", (event) => {
            const itemId = parseInt(event.target.getAttribute("data-id"));
            removeFromCart(itemId);
        });
    });
}

// Initialisera sidan / varukorg
document.addEventListener("DOMContentLoaded", async () => {
    if (document.getElementById("menu")) {
        const menuItems = await fetchMenuItems();
        renderMenu(menuItems);
    }
    if (document.getElementById("cart")) {
        updateCart();
    }
});