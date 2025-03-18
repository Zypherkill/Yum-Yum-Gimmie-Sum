import { getUsers, getProducts } from "./api.js";
import { showOrderHistory } from "./orderHistory.js"; // Import the function from the other file

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

// Function to render Products table
function renderProducts(productList, productsTableBody) {
    productsTableBody.innerHTML = ""; // Clear the table

    productList.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.type}</td>
            <td>${product.description}</td>
            <td><button class="view-btn">Remove</button></td>
        `;
        productsTableBody.appendChild(row);
    });
}

// Function to filter Products
function filterProducts(products, productsTableBody, productsSearchInput) {
    const searchValue = productsSearchInput.value.toLowerCase();

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchValue) || 
        product.type.toLowerCase().includes(searchValue)
    );

    renderProducts(filteredProducts, productsTableBody);
}

// Main function to show the Admin Panel
export async function showAdminPanel() {
    document.addEventListener("DOMContentLoaded", async function () {
        const userData = await getUsers();
        const users = userData?.users ?? []; 

        // DOM Elements
        const usersSearchInput = document.getElementById('search');
        const usersTableBody = document.getElementById('usersTable').querySelector('tbody');
        const ordersMenuBtn = document.getElementById('ordersMenuBtn');
        const usersMenuBtn = document.getElementById('usersMenuBtn');
        const usersTableContainer = document.getElementById('usersTableContainer');
        const ordersTableContainer = document.getElementById('ordersTableContainer');

        // Attach event listeners
        usersSearchInput.addEventListener('input', () => filterUsers(users, usersTableBody, usersSearchInput));

        usersMenuBtn.addEventListener('click', () => {
            console.log('Users menu button clicked');
            usersTableContainer.style.display = 'block';
            ordersTableContainer.style.display = 'none';
        });

        ordersMenuBtn.addEventListener('click', () => {
            console.log('Orders menu button clicked');
            ordersTableContainer.style.display = 'block';
            usersTableContainer.style.display = 'none';
            showOrderHistory(); // Call the imported function to show order history
        });

        // Initial Render
        renderUsers(users, usersTableBody);

        // Get products
        const productData = await getProducts();
        const products = productData?.items ?? [];

        // Hide tables by default
        usersTableContainer.style.display = 'none'; 
        ordersTableContainer.style.display = 'none'; 
    });
}

showAdminPanel();
