import { saveOrderHistory } from "./userHandling.js";

function displayETA(eta) {
    let formattedETA = formatTime(eta);

    let article = document.createElement("article");
    let img = document.createElement("img");
    let h2 = document.createElement("h2");
    let p = document.createElement("p");

    article.classList.add("delivery");
    img.classList.add("delivery__img");
    h2.classList.add("delivery__heading");
    p.classList.add("delivery__text");

    img.src = "../assets/images/food-box.png";
    img.alt = "image of delivery container";

    h2.textContent = "Din mat är på väg!";

    p.textContent = `ETA ${formattedETA} min.`;

    article.appendChild(img);
    article.appendChild(h2);
    article.appendChild(p);

    document.querySelector(".content-wrapper").appendChild(article);
}

function getRandomTime(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function placeOrder() {
    let eta = getRandomTime(15, 30);
    displayETA(eta);

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length > 0) {
        saveOrderHistory(cart);
        localStorage.setItem("lastOrder", JSON.stringify(cart)); // Save the order for receipt display
        localStorage.removeItem("cart"); // Clear the cart after placing the order
    }
}

function formatTime(time) {
    let minutes = time % 60;
    return `${minutes}`;
}
