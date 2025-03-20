export function showOrderHistory() {
    document.addEventListener("DOMContentLoaded", () => {
        const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];

        // Ensure orderHistory is an array
        if (!Array.isArray(orderHistory)) {
            console.error("orderHistory is not an array. Check localStorage structure.");
            return;
        }

        const historyContainer = document.querySelector(".history-container");
        if (!historyContainer) return; // Ensure the container exists

        historyContainer.innerHTML =
            orderHistory.length > 0
                ? orderHistory
                      .map(
                          (order) => `
                    <div class="order">
                        <h2>${order.orderNumber}</h2>
                        <ul>
                            ${order.items
                                .map(
                                    (item) =>
                                        `<li>${item.name} - ${item.quantity} x ${item.price} kr</li>`
                                )
                                .join("")}
                        </ul>
                        <p>Totalt: ${order.items.reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0
                        )} kr</p>
                    </div>
                `
                      )
                      .join("")
                : "<p>Det finns inga ordrar.</p>";
    });
}


export function generateOrderNumber() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let orderNumber = "Ordernummer: #";
    
    for (let i = 0; i < 6; i++) {
        let randomIndex = Math.floor(Math.random() * characters.length);
        orderNumber += characters.charAt(randomIndex);
    }
    
    return orderNumber;
}