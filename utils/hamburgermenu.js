export function showNavigation () {
const hamburgerMenu = document.querySelector('.hamburger-menu');
const slideMenu = document.querySelector('.navigation');
const closeButton = document.querySelector('.fa-xmark');
const contentWrapper = document.querySelector('.about-us');

hamburgerMenu.addEventListener('click', () => {
    slideMenu.classList.add('open');
    contentWrapper.classList.add('blur');
});

closeButton.addEventListener('click', () => {
    slideMenu.classList.remove('open');
    contentWrapper.classList.remove('blur');
});
}