import { getUsers, getProducts } from "./api.js";
import { showOrderHistory } from "./orderHistory.js";

// Function to render Users table
function renderUsers(userList, usersTableBody) {
    usersTableBody.innerHTML = ""; // Clear the table

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
function renderOrders(orderList, ordersTableBody) {
    ordersTableBody.innerHTML = ""; // Clear the table

    orderList.forEach(order => {
        order.items.forEach(item => { // Iterate over items in each order
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${order.orderNumber}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price} sek</td>
                <td>${order.status || "Pending"}</td>
                <td><button class="change-status-btn">Change Status</button></td>
            `;
        
            // Add the row to the table
            ordersTableBody.appendChild(row);

            // Add event listener to the "Change Status" button
            const changeStatusButton = row.querySelector(".change-status-btn");
            changeStatusButton.addEventListener("click", () => {
                changeOrderStatus(order); // Pass the current order to change its status
            });
        });
    });
}

// Function to handle changing the order status
function changeOrderStatus(order) {
    const newStatus = prompt("Enter new status for order " + order.orderNumber, order.status || "Pending");

    if (newStatus !== null) {
        order.status = newStatus; // Update the status of the order

        // Save the updated order in localStorage
        let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
        const orderIndex = orderHistory.findIndex(o => o.orderNumber === order.orderNumber);
        if (orderIndex !== -1) {
            orderHistory[orderIndex] = order; // Update the order in the array
            localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
        }

        // Re-render the table to reflect the updated status
        const ordersTableBody = document.querySelector("#ordersTable tbody");
        renderOrders(orderHistory, ordersTableBody);
    }
}


// Function to fetch orders from localStorage and display them
function adminShowOrderHistory(ordersTableBody) {
    const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
    renderOrders(orderHistory, ordersTableBody);
}

// Main function to show the Admin Panel
export async function showAdminPanel() {
    document.addEventListener("DOMContentLoaded", async function () {
        const userData = await getUsers();
        const users = userData?.users ?? []; 

        // DOM Elements
        const usersSearchInput = document.getElementById("search");
        const usersTableBody = document.getElementById("usersTable").querySelector("tbody");
        const ordersTableBody = document.getElementById("ordersTable").querySelector("tbody");
        const ordersMenuBtn = document.getElementById("ordersMenuBtn");
        const usersMenuBtn = document.getElementById("usersMenuBtn");
        const usersTableContainer = document.getElementById("usersTableContainer");
        const ordersTableContainer = document.getElementById("ordersTableContainer");

        // Render Users Table
        renderUsers(users, usersTableBody);

        // Get Products
        const productData = await getProducts();
        const products = productData?.items ?? [];

        // Hide tables by default
        usersTableContainer.style.display = "none";
        ordersTableContainer.style.display = "none";

        // Event Listeners
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
            
            // Fetch and display orders
            adminShowOrderHistory(ordersTableBody);
        });
    });
}

showAdminPanel();
