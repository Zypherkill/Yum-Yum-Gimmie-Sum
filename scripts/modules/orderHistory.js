export function showOrderHistory() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("Du måste vara inloggad för att se din orderhistorik.");
        window.location.href = "login.html";
        return;
    }

    const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || {};
    const userOrders = orderHistory[loggedInUser.email] || [];

    const historyContainer = document.querySelector(".history-container");
    historyContainer.innerHTML =
        userOrders.length > 0
            ? userOrders
                  .map(
                      (order) => `
            <div class="order">
                <h2>Order: ${order.id}</h2>
                <ul>
                    ${order
                        .map(
                            (item) =>
                                `<li>${item.name} - ${item.quantity} x ${item.price} sek</li>`
                        )
                        .join("")}
                </ul>
                <p>Totalt: ${order.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                )} sek</p>
            </div>
        `
                  )
                  .join("")
            : "<p>Du har inga tidigare ordrar.</p>";
}
