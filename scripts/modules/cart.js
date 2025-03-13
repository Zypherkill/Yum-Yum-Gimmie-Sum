// Hämta varukorg
export function getCart() {
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

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Din varukorg är tom.</p>";
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <article class="menu-item">
            <h2 class="menu-title">${item.name} x ${item.quantity}</h2>
            <p class="menu-price">${item.price * item.quantity} sek</p>
            <i class="fa-solid fa-circle-plus add-to-cart" data-id="${item.id}"></i>
            <i class="fa-solid fa-circle-minus remove-from-cart" data-id="${item.id}"></i>
        </article>
    `).join("");

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartContainer.innerHTML += `<article class="menu-item total-price-container">
        <p class="total-price">Total: ${totalPrice} SEK</p>
    </article>

    <article class="orderButtonArticle">
    <a href="/pages/bestallning.html" class="button button--top orderButton"> <button>TAKE MY MONEY</button></a>
    </article>`;

}

export { updateCart };

// Lyssna på klick för att lägga till och ta bort från varukorgen
document.getElementById("cart")?.addEventListener("click", (event) => {
    const itemId = parseInt(event.target.getAttribute("data-id"));

    if (event.target.classList.contains("remove-from-cart")) {
        removeFromCart(itemId);
        updateCart();
    }

    if (event.target.classList.contains("add-to-cart")) {
        const cart = getCart();
        const item = cart.find(cartItem => cartItem.id === itemId);
        if (item) {
            addToCart(item);
        }
    }
});



// När sidan laddas, rendera menyn och varukorgen
document.addEventListener("DOMContentLoaded", () => {
    renderMenu(); // Visar endast produkter i varukorgen
    updateCart();

    // Kontrollerar så modalen existerar, annars kör den inte eventlyssnarna
    const closeModalButton = document.querySelector(".close-modal");
    const cartModal = document.getElementById("cart-modal");

    if (closeModalButton && cartModal) {
        closeModalButton.addEventListener("click", () => {
            cartModal.classList.add("hidden");
        });

        cartModal.addEventListener("click", (event) => {
            if (event.target === cartModal) {
                cartModal.classList.add("hidden");
            }
        });
    }
});

