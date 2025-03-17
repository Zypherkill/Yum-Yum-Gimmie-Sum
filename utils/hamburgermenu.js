export function showNavigation () {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const slideMenu = document.querySelector('.navigation');
    const closeButton = document.querySelector('.fa-xmark');
    const contentWrapper = document.querySelector('.content-wrapper');
    const menuWrapper = document.querySelector('.menu-wrapper');
    
    hamburgerMenu.addEventListener('click', () => {
        slideMenu.classList.add('open');
        if (window.location.pathname === ("/pages/meny.html")) {
            menuWrapper.classList.add('blur');
        } else {
            contentWrapper.classList.add('blur');
        }
    });
    
    closeButton.addEventListener('click', () => {
        slideMenu.classList.remove('open');
        if (window.location.pathname === ("/pages/meny.html")) {
            menuWrapper.classList.remove('blur');
        } else {
            contentWrapper.classList.remove('blur');
        }
    });
    }