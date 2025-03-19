export function showNavigation() { 
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const slideMenu = document.querySelectorAll('.navigation');
    const closeButton = document.querySelectorAll('.fa-xmark');
    const contentWrapper = document.querySelector('.content-wrapper');
    const menuWrapper = document.querySelector('.menu-wrapper');
    const adminPanelBtn = document.querySelector('#adminPanelBtn'); // Ensure this targets the correct button

 if (adminPanelBtn) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser && loggedInUser.role === 'admin') {
        adminPanelBtn.style.display = 'block'; // Show button if user is admin
        adminPanelBtn.addEventListener('click', () => {
            window.location.href = 'adminPanel.html';
        });
    }
}
    // Hamburger menu functionality
    hamburgerMenu.addEventListener('click', () => {
        slideMenu.forEach(menu => {
            menu.classList.add('open');
        });
        if (window.location.pathname === "/pages/meny.html") {
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
            if (window.location.pathname === "/pages/meny.html") {
                menuWrapper.classList.remove('blur');
            } else {
                contentWrapper.classList.remove('blur');
            }
        });
    });
}
