import { getUsers, getProducts } from "./api.js";
import { showOrderHistory } from "./orderHistory.js";

// Function to render Users table
function renderUsers(userList, usersTableBody) {
    usersTableBody.innerHTML = "";
    userList.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.password}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><button class="view-btn">Remove</button></td>
        `;
        usersTableBody.appendChild(row);
    });
}

// render order history
function renderOrders(orderList, ordersTableBody) {
    ordersTableBody.innerHTML = "";
    
    orderList.forEach(order => {
        order.items.forEach(item => {
            const row = document.createElement("tr");
            
            // Status dropdown
            const statusDropdown = document.createElement("select");
            const statuses = ["Pending", "Processing", "Completed"];

            statuses.forEach(status => {
                const option = document.createElement("option");
                option.value = status;
                option.textContent = status;
                if (order.status === status) {
                    option.selected = true;
                }
                statusDropdown.appendChild(option);
            });

            // Event listener to update status
            statusDropdown.addEventListener("change", () => {
                updateOrderStatus(order, statusDropdown.value);
            });

            row.innerHTML = `
                <td>${order.orderNumber}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price} sek</td>
                <td></td> 
            `;

            row.children[4].appendChild(statusDropdown); // Append dropdown to status column
            ordersTableBody.appendChild(row);
        });
    });
}

function updateOrderStatus(order, newStatus) {
    order.status = newStatus;
    
    let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
    const orderIndex = orderHistory.findIndex(o => o.orderNumber === order.orderNumber);
    
    if (orderIndex !== -1) {
        orderHistory[orderIndex] = order;
        localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
    }
}


function adminShowOrderHistory(ordersTableBody) {
    const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
    renderOrders(orderHistory, ordersTableBody);
}

// Function to filter orders by status
function filterOrdersByStatus(status, ordersTableBody) {
    const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
    const filteredOrders = status === "All" ? orderHistory : orderHistory.filter(order => order.status === status);
    renderOrders(filteredOrders, ordersTableBody);
}
export async function showAdminPanel() {
    document.addEventListener("DOMContentLoaded", async function () {
        const userData = await getUsers();
        const users = userData?.users ?? [];
        const usersSearchInput = document.getElementById("search");
        const usersTableBody = document.getElementById("usersTable").querySelector("tbody");
        const ordersTableBody = document.getElementById("ordersTable").querySelector("tbody");
        const ordersMenuBtn = document.getElementById("ordersMenuBtn");
        const usersMenuBtn = document.getElementById("usersMenuBtn");
        const usersTableContainer = document.getElementById("usersTableContainer");
        const ordersTableContainer = document.getElementById("ordersTableContainer");
        const statusFilter = document.getElementById("statusFilter");

        renderUsers(users, usersTableBody);
        const productData = await getProducts();
   
        usersTableContainer.style.display = "none";
        ordersTableContainer.style.display = "none";

        usersSearchInput.addEventListener("input", () =>
            filterUsers(users, usersTableBody, usersSearchInput)
        );

        usersMenuBtn.addEventListener("click", () => {
            usersTableContainer.style.display = "block";
            ordersTableContainer.style.display = "none";
        });

        ordersMenuBtn.addEventListener("click", () => {
            ordersTableContainer.style.display = "block";
            usersTableContainer.style.display = "none";
            adminShowOrderHistory(ordersTableBody);
        });

        statusFilter.addEventListener("change", (event) => {
            filterOrdersByStatus(event.target.value, ordersTableBody);
        });
    });
}

showAdminPanel();