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

// updatera display ETA till = (eta, dish)  `Dina ${dish} är klar om ${formattedETA} minuter.`;

function getRandomTime(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function placeOrder() {
    let eta = getRandomTime(15, 30);
    displayETA(eta);
}
// updatera placeOrder med = (dish) och displayETA(eta, dish)

function formatTime(time) {
    let minutes = time % 60;
    return `${minutes}`;
}
