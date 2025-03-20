import { saveOrderHistory } from "./userHandling.js";

export function getOrderFromLocalStorage() {
    const lastOrder = localStorage.getItem("lastOrder");
    return lastOrder ? JSON.parse(lastOrder) : null;
}

// Funktion för att visa kvittot
export function displayReceipt() {
    const order = getOrderFromLocalStorage();
    console.log("Order retrieved from localStorage:", order);

    if (!order || !order.items || !Array.isArray(order.items) || order.items.length === 0) {
        console.log("Ingen beställning hittades eller order är inte en array.");
        return;
    }

    const receiptContainer = document.querySelector(".receipt-container");
    if (!receiptContainer) {
        console.error("Receipt container element not found.");
        return;
    }
    receiptContainer.innerHTML = ""; // Rensa tidigare kvitto

    const receiptTitle = document.createElement("h2");
    receiptTitle.textContent = "Kvitto";
    receiptContainer.appendChild(receiptTitle);

    const orderList = document.createElement("ul");
    order.items.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} - ${item.quantity} x ${item.price} sek`;
        orderList.appendChild(listItem);
    });
    receiptContainer.appendChild(orderList);

    const totalPrice = order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const totalPriceElement = document.createElement("p");
    totalPriceElement.textContent = `Totalt: ${totalPrice} sek`;
    receiptContainer.appendChild(totalPriceElement);
}

// Kontrollera om vi är på kvitto.html-sidan
if (window.location.pathname.includes("kvitto.html")) {
    document.addEventListener("DOMContentLoaded", displayReceipt);
}

// Kontrollera om vi är på bestallning.html-sidan
if (window.location.pathname.includes("bestallning.html")) {
    document.addEventListener("DOMContentLoaded", () => {
        // Lägger till lyssnare på knappen för att visa kvittot
        document
            .addEventListener("click", () => {
                document.getElementById("receipt-overlay").style.display = "block";
            });

        // Lägger till lyssnare på stängningsknappen för att dölja overlayen
        document.getElementById("close-overlay").addEventListener("click", () => {
            document.getElementById("receipt-overlay").style.display = "none";
        });

        // Lägger till lyssnare på knappen för att göra en ny beställning
        document.querySelector("#new-order").addEventListener("click", () => {
            localStorage.removeItem("cart"); // Rensa cart i local storage
            localStorage.removeItem("lastOrder"); // Rensa lastOrder
            window.location.href = "meny.html"; // Navigera till menynsidan
        });
    });
}   