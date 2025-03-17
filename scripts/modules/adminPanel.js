import { getUsers } from "./api.js";

export function showAdminPanel() {
    document.addEventListener("DOMContentLoaded", async function () {
        // Fetch Users data from API
        const userData = await getUsers();

        // Extract users array from userData object
        const users = userData?.users ?? []; 
        

        // DOM Elements
        const usersSearchInput = document.getElementById('search');
        const usersTableBody = document.getElementById('usersTable').querySelector('tbody');
        const ordersMenuBtn = document.getElementById('ordersMenuBtn');
        const usersMenuBtn = document.getElementById('usersMenuBtn');
        const ordersTableContainer = document.getElementById('ordersTableContainer');
        const usersTableContainer = document.getElementById('usersTableContainer');

        // Function to render Users table
        function renderUsers(userList) {
            // Clear the table before rendering new data
            usersTableBody.innerHTML = "";
            
            // Render each user as a row in the table
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

        // Filter Users Function
        function filterUsers() {
            const searchValue = usersSearchInput.value.toLowerCase();

            const filteredUsers = users.filter(user => 
                user.username.toLowerCase().includes(searchValue) || 
                user.email.toLowerCase().includes(searchValue)
            );

            renderUsers(filteredUsers);
        }

        // Event Listeners, to be changed to global event listeners
        usersSearchInput.addEventListener('input', filterUsers);

        usersMenuBtn.addEventListener('click', () => {
            usersTableContainer.style.display = 'block';
            ordersTableContainer.style.display = 'none';
        });

        ordersMenuBtn.addEventListener('click', () => {
            ordersTableContainer.style.display = 'block';
            usersTableContainer.style.display = 'none';
        });

        // Initial Render
        renderUsers(users);
        // Hide tables by default
        usersTableContainer.style.display = 'none'; 
        ordersTableContainer.style.display = 'none'; 
    });
}
