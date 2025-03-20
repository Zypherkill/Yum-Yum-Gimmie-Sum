export function showNavigation() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const slideMenu = document.querySelectorAll('.navigation');
    const closeButton = document.querySelectorAll('.fa-xmark');
    const contentWrapper = document.querySelector('.content-wrapper');
    const menuWrapper = document.querySelector('.menu-wrapper');
    const adminPanelBtn = document.querySelector('#adminPanelBtn'); // Ensure this targets the correct button

    // Ensure the hamburger menu is focusable and has key events
    if (hamburgerMenu) {
        hamburgerMenu.setAttribute('tabindex', '0'); // Make it focusable for keyboard navigation
        hamburgerMenu.addEventListener('click', toggleMenu);
        hamburgerMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
    }

    // Ensure the close button is focusable and has key events
    if (closeButton.length > 0) {
        closeButton.forEach(button => {
            button.setAttribute('tabindex', '0'); // Make it focusable for keyboard navigation
            button.addEventListener('click', closeMenu);
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    closeMenu();
                }
            });
        });
    }

    // Function to toggle the slide menu open and closed
    function toggleMenu() {
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
    }

    // Function to close the slide menu
    function closeMenu() {
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
    }

    // Ensure adminPanelBtn exists and the user is logged in as an admin
    if (adminPanelBtn) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser && loggedInUser.role === 'admin') {
            adminPanelBtn.style.display = 'block'; 
            adminPanelBtn.setAttribute('tabindex', '0'); // Make it focusable
            adminPanelBtn.addEventListener('click', () => {
                window.location.href = 'adminPanel.html';
            });
            adminPanelBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.location.href = 'adminPanel.html';
                }
            });
        }
    }

    // Cart icon logic
    const cartIcon = document.querySelector('.cart-icon');
    function openCart() {
        const cartModal = document.getElementById('cart-modal');
        cartModal.classList.remove('hidden'); // Show the cart modal
    }

    if (cartIcon) {
        cartIcon.addEventListener('click', openCart);

        // Add event listener for Enter and Space
        cartIcon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openCart();
            }
        });
    }
}
