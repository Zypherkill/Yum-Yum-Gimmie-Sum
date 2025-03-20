export function showOrderHistory() {
    document.addEventListener("DOMContentLoaded", () => {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")); // Get logged-in user

        if (!loggedInUser || !loggedInUser.email) {
            console.error("No logged-in user found.");
            return;
        }

        const userOrderKey = `orderHistory_${loggedInUser.email}`; // Fetch orders for this user
        const orderHistory = JSON.parse(localStorage.getItem(userOrderKey)) || [];

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
                : "<p>Du har inga tidigare beställningar.</p>";
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