// Funktion för att hämta beställningsinformation från local storage
export function getOrderFromLocalStorage() {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : null;
}

// Funktion för att visa kvittot
export function displayReceipt() {
    const order = getOrderFromLocalStorage();
    if (!order || order.length === 0) {
        console.log("Ingen beställning hittades.");
        return;
    }

    const receiptContainer = document.querySelector(".receipt-container");
    receiptContainer.innerHTML = ""; // Rensa tidigare kvitto

    const receiptTitle = document.createElement("h2");
    receiptTitle.textContent = "Kvitto";
    receiptContainer.appendChild(receiptTitle);

    const orderList = document.createElement("ul");
    order.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} - ${item.quantity} x ${item.price} sek`;
        orderList.appendChild(listItem);
    });
    receiptContainer.appendChild(orderList);

    const totalPrice = order.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const totalPriceElement = document.createElement("p");
    totalPriceElement.textContent = `Totalt: ${totalPrice} sek`;
    receiptContainer.appendChild(totalPriceElement);

    // Visa overlayen
    document.getElementById("receipt-overlay").style.display = "flex";
}

// Kontrollera om vi är på bestallning.html-sidan
if (window.location.pathname.includes("bestallning.html")) {
    // Lägger till lyssnare på knappen för att visa kvittot
    document
        .getElementById("receipt-button")
        .addEventListener("click", displayReceipt);

    // Lägger till lyssnare på stängningsknappen för att dölja overlayen
    document.getElementById("close-overlay").addEventListener("click", () => {
        document.getElementById("receipt-overlay").style.display = "none";
    });

    // Lägger till lyssnare på knappen för att göra en ny beställning
    document.querySelector("#new-order").addEventListener("click", () => {
        localStorage.removeItem("cart"); // Rensa local storage
        window.location.href = "meny.html"; // Navigera till menynsidan
    });
}
