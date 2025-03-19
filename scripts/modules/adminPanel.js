import { getUsers, getProducts } from "./api.js";
import { showOrderHistory } from "./orderHistory.js";
import { globalEventListener } from "../../utils/globalEventListener.js"; 

// Function to render Users table
function renderUsers(userList, usersTableBody) {
    usersTableBody.innerHTML = "";
    userList.forEach(user => {
        const row = document.createElement("tr");

        // Role dropdown
        const roleDropdown = document.createElement("select");
        const roles = ["user", "admin"];

        roles.forEach(role => {
            const option = document.createElement("option");
            option.value = role;
            option.textContent = role;
            if (user.role === role) {
                option.selected = true;
            }
            roleDropdown.appendChild(option);
        });

        // Event listener to update role
        globalEventListener.add("change", "select", (event, element) => {
            if (element === roleDropdown) {
                updateUserRole(user, element.value);
            }
        });

        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.password}</td>
            <td>${user.email}</td>
            <td></td>
            <td><button class="view-btn">Remove</button></td>
        `;
        // Append dropdown to role column
        row.children[3].appendChild(roleDropdown);
        usersTableBody.appendChild(row);
    });
}

// Function to filter users by search input
function filterUsers(userList, usersTableBody, searchInput) {
    const searchValue = searchInput.value.toLowerCase();
    const filteredUsers = userList.filter(user =>
        user.username.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue)
    );
    renderUsers(filteredUsers, usersTableBody);
}

function updateUserRole(user, newRole) {
    user.role = newRole;
    
    let storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = storedUsers.findIndex(u => u.email === user.email);

    if (userIndex !== -1) {
        storedUsers[userIndex] = user;
        localStorage.setItem("users", JSON.stringify(storedUsers));
    }
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
            globalEventListener.add("change", "select", (event, element) => {
                if (element === statusDropdown) {
                    updateOrderStatus(order, element.value);
                }
            });

            row.innerHTML = `
                <td>${order.orderNumber}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price} sek</td>
                <td></td>
            `;
            // Append dropdown to status column
            row.children[4].appendChild(statusDropdown);
            ordersTableBody.appendChild(row);
        });
    });
}

// Function to update order status
function updateOrderStatus(order, newStatus) {
    order.status = newStatus;
    
    let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
    const orderIndex = orderHistory.findIndex(o => o.orderNumber === order.orderNumber);
    
    if (orderIndex !== -1) {
        orderHistory[orderIndex] = order;
        localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
    }
}

// Function to render order history
function adminShowOrderHistory(ordersTableBody) {
    const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
    renderOrders(orderHistory, ordersTableBody);
}

// Function to filter orders by statusx 
function filterOrdersByStatus(status, ordersTableBody) {
    const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
    const filteredOrders = status === "All" ? orderHistory : orderHistory.filter(order => order.status === status);
    renderOrders(filteredOrders, ordersTableBody);
}

export async function showAdminPanel() {
    document.addEventListener("DOMContentLoaded", async function () {
        const userData = await getUsers();
         // Users from API response
        const apiUsers = userData?.users ?? [];

        // Fetch users from localStorage
        let storedUsers = JSON.parse(localStorage.getItem("users")) || [];

        // Combine both sources and remove duplicates based on email (assuming email is unique)
        const allUsers = [...storedUsers, ...apiUsers.filter(apiUser => 
            !storedUsers.some(storedUser => storedUser.email === apiUser.email)
        )];

        // Save updated users list to localStorage
        localStorage.setItem("users", JSON.stringify(allUsers));

        // DOM Elements
        const usersSearchInput = document.getElementById("search");
        const usersTableBody = document.getElementById("usersTable").querySelector("tbody");
        const ordersTableBody = document.getElementById("ordersTable").querySelector("tbody");
       
        const usersTableContainer = document.getElementById("usersTableContainer");
        const ordersTableContainer = document.getElementById("ordersTableContainer");


        // Render Users Table with combined users
        renderUsers(allUsers, usersTableBody);


        usersTableContainer.style.display = "none";
        ordersTableContainer.style.display = "none";

        globalEventListener.add("input", "#search", () =>
            filterUsers(allUsers, usersTableBody, usersSearchInput)
        );

        globalEventListener.add("click", "#usersMenuBtn", () => {
            usersTableContainer.style.display = "block";
            ordersTableContainer.style.display = "none";
        });

        globalEventListener.add("click", "#ordersMenuBtn", () => {
            ordersTableContainer.style.display = "block";
            usersTableContainer.style.display = "none";
            adminShowOrderHistory(ordersTableBody);
        });

        globalEventListener.add("change", "#statusFilter", (event) => {
            filterOrdersByStatus(event.target.value, ordersTableBody);
        });
    });
}


