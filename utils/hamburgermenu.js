export function showNavigation() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const slideMenu = document.querySelectorAll('.navigation');
    const closeButton = document.querySelectorAll('.fa-xmark');
    const contentWrapper = document.querySelector('.content-wrapper');
    const menuWrapper = document.querySelector('.menu-wrapper');
    
    hamburgerMenu.addEventListener('click', () => {
        slideMenu.forEach(menu => {
            menu.classList.add('open');
        });
        if (window.location.pathname === ("/pages/meny.html")) {
            menuWrapper.classList.add('blur');
        } else {
            contentWrapper.classList.add('blur');
        }
    });
    
    closeButton.forEach(button => {
        button.addEventListener('click', () => {
            slideMenu.forEach(menu => {
                menu.classList.remove('open');
            });
            if (window.location.pathname === ("/pages/meny.html")) {
                menuWrapper.classList.remove('blur');
            } else {
                contentWrapper.classList.remove('blur');
            }
        });
    });
}