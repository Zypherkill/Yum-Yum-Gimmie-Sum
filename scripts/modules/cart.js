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
            <i class="fa-solid fa-circle-plus add-to-cart" data-id="${item.id}"></i>
            <i class="fa-solid fa-circle-minus remove-from-cart" data-id="${item.id}"></i>
        </article>
    `).join("");
}

// Uppdatera varukorgen
function updateCart() {
    const cartContainer = document.getElementById("cart");
    if (!cartContainer) return;

    const cart = getCart();

    // Skapa HTML för varje produkt i varukorgen
    cartContainer.innerHTML = cart.map(item => `
        <article class="menu-item">
            <h2 class="menu-title">${item.name} x ${item.quantity}</h2>
            <p class="menu-ingredients">${Array.isArray(item.ingredients) && item.ingredients.length > 0 ? item.ingredients.join(', ') : "Inga ingredienser"}</p>
            <p class="menu-price">${item.price * item.quantity} sek</p>
            <i class="fa-solid fa-circle-plus add-to-cart" data-id="${item.id}"></i>
            <i class="fa-solid fa-circle-minus remove-from-cart" data-id="${item.id}"></i>
        </article>
    `).join("");

    // Beräkna totalpris
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Lägg till totalpris i slutet av varukorgen
    cartContainer.innerHTML += `<article class="menu-item total-price-container">
    <p class="total-price">
        <span>Total:</span>
        <span>${totalPrice} SEK</span>
    </p>
    </article>

    <article class="orderButtonArticle">
    <a href="/pages/bestallning.html" class="button button--top orderButton"> <button>TAKE MY MONEY</button></a>
    </article>`;

}


// Lyssna på klick för att lägga till och ta bort från varukorgen
document.addEventListener("click", (event) => {
    const itemId = parseInt(event.target.getAttribute("data-id"));

    if (event.target.classList.contains("remove-from-cart")) {
        removeFromCart(itemId);
        updateCart(); // Uppdatera både varukorgen och menyn
    }

    if (event.target.classList.contains("add-to-cart")) {
        const cart = getCart();
        const item = cart.find(cartItem => cartItem.id === itemId);

        if (item) {
            addToCart(item); // Lägg till en till av befintlig produkt
        }
    }
});


// När sidan laddas, rendera menyn och varukorgen
document.addEventListener("DOMContentLoaded", () => {
    renderMenu(); // Visar endast produkter i varukorgen
    updateCart();
});
