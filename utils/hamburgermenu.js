export function showNavigation() { 
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const slideMenu = document.querySelectorAll('.navigation');
    const closeButton = document.querySelectorAll('.fa-xmark');
    const contentWrapper = document.querySelector('.content-wrapper');
    const menuWrapper = document.querySelector('.menu-wrapper');
    const adminPanelBtn = document.querySelector('#adminPanelBtn'); // Ensure this targets the correct button

    // Get the logged-in user from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    // Check if the logged-in user exists and is an admin
    if (loggedInUser && loggedInUser.role === 'admin') {
        // If the user is an admin, show the admin panel button
        adminPanelBtn.style.display = 'block'; // Show the admin panel button
        adminPanelBtn.addEventListener('click', () => {
            window.location.href = 'adminPanel.html'; // Redirect to the admin panel page
        });
    }

    // Hamburger menu functionality
    hamburgerMenu.addEventListener('click', () => {
        slideMenu.forEach(menu => {
            menu.classList.add('open');
        });
        if (window.location.pathname.includes ("/pages/meny.html")) {
            menuWrapper.classList.add('blur');
        } else {
            contentWrapper.classList.add('blur');
        }
    });

    // Close button functionality
    closeButton.forEach(button => {
        button.addEventListener('click', () => {
            slideMenu.forEach(menu => {
                menu.classList.remove('open');
            });
            if (window.location.pathname.includes ("/pages/meny.html")) {
                menuWrapper.classList.remove('blur');
            } else {
                contentWrapper.classList.remove('blur');
            }
        });
    });
}
