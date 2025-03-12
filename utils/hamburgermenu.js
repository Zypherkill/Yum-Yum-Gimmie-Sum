export function showNavigation () {
const hamburgerMenu = document.querySelector('.hamburger-menu');
const slideMenu = document.querySelector('.navigation');
const closeButton = document.querySelector('.fa-xmark');

hamburgerMenu.addEventListener('click', () => {
    slideMenu.classList.add('open');
});

closeButton.addEventListener('click', () => {
    slideMenu.classList.remove('open');
});
}