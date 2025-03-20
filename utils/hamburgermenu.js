export function showNavigation() { 
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const slideMenu = document.querySelectorAll('.navigation');
    const closeButton = document.querySelectorAll('.fa-xmark');
    const contentWrapper = document.querySelector('.content-wrapper');
    const menuWrapper = document.querySelector('.menu-wrapper');
    const adminPanelBtn = document.querySelector('#adminPanelBtn'); // Ensure this targets the correct button

    // Check if hamburgerMenu exists before adding event listener
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            if (slideMenu.length > 0) {
                slideMenu.forEach(menu => {
                    menu.classList.add('open');
                });
            }

            // Conditionally add blur depending on the page
            if (window.location.pathname.includes("/pages/meny.html")) {
                if (menuWrapper) {
                    menuWrapper.classList.add('blur');
                }
            } else {
                if (contentWrapper) {
                    contentWrapper.classList.add('blur');
                }
            }
        });
    }

    // Check if closeButton exists before adding event listener
    if (closeButton.length > 0) {
        closeButton.forEach(button => {
            button.addEventListener('click', () => {
                if (slideMenu.length > 0) {
                    slideMenu.forEach(menu => {
                        menu.classList.remove('open');
                    });
                }

                // Conditionally remove blur depending on the page
                if (window.location.pathname.includes("/pages/meny.html")) {
                    if (menuWrapper) {
                        menuWrapper.classList.remove('blur');
                    }
                } else {
                    if (contentWrapper) {
                        contentWrapper.classList.remove('blur');
                    }
                }
            });
        });
    }

    // Ensure adminPanelBtn exists and the user is logged in as an admin
    if (adminPanelBtn) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser && loggedInUser.role === 'admin') {
            adminPanelBtn.style.display = 'block'; 
            adminPanelBtn.addEventListener('click', () => {
                window.location.href = 'adminPanel.html';
            });
        }
    }
}
