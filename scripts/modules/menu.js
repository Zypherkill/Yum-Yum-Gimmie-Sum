import { getProducts } from "./api.js";
import { addToCart, removeFromCart } from "./cart.js";
import { globalEventListener } from "../../utils/globalEventListener.js";

export let productData = [];

export async function showMenu() {
	//debuging
    console.log("showMenu called");

    productData = await getProducts();

     //debuging
    console.log("productData:", productData);

    const wrapperRef = document.querySelector('.menu-wrapper');
    

    // Clear the wrapper before appending new elements
    wrapperRef.innerHTML = '';

    // Skapar en sektion som håller texten "Meny" samt en ikon för att filtrera
    const headerRef = document.createElement('section');
    headerRef.classList.add('menu-header');

    const headerText = document.createElement('h1');
    headerText.textContent = "Meny";

    const filterIcon = document.createElement('i');
    filterIcon.classList.add('fa-solid', 'fa-filter');

    headerRef.appendChild(headerText);
    headerRef.appendChild(filterIcon);

    wrapperRef.appendChild(headerRef);

    // Populerar menyn med rätterna
    const menuRef = document.createElement('section');
    menuRef.classList.add('menu-items');

  productData.forEach((item) => {
		const menuItem = document.createElement('article');
		menuItem.classList.add('menu-item');
        
		const itemName = document.createElement('h2');
		itemName.textContent = item.name;
		itemName.classList.add('menu-title')

		const itemIngredients = document.createElement('p');
        if (Array.isArray(item.ingredients) && item.ingredients.length > 0) {
            itemIngredients.textContent = item.ingredients.join(', ');
        } else {
            itemIngredients.textContent = "";
        }
        itemIngredients.classList.add('menu-ingredients');

		const itemPrice = document.createElement('p');
		itemPrice.textContent = `${item.price} sek`;
		itemPrice.classList.add('menu-price')

		const plusButton = document.createElement('i');
		plusButton.classList.add('fa-solid', 'fa-circle-plus');
		plusButton.setAttribute('data-id', item.id); // Set data-id attribute to item.id

		const minusButton = document.createElement('i');
		minusButton.classList.add('fa-solid', 'fa-circle-minus');
		minusButton.setAttribute('data-id', item.id); // Set data-id attribute to item.id

		menuRef.appendChild(menuItem);
		menuItem.appendChild(itemName);
		menuItem.appendChild(itemIngredients);
		menuItem.appendChild(itemPrice);
		menuItem.appendChild(minusButton);
		menuItem.appendChild(plusButton);
		
		wrapperRef.appendChild(menuRef);
	})

    console.log("Menu items appended");

    // Add to cart
    globalEventListener.add("click", ".fa-circle-plus", async (event, button) => {
        const itemId = parseInt(button.getAttribute("data-id"));
        const menuItems = await getProducts();
        const item = menuItems.find(item => item.id === itemId);
        if (item) {
            addToCart(item);
			alert("Added to cart! Item ID: " + itemId);
        }
    });
     //remove from cart
    globalEventListener.add("click", ".fa-circle-minus", (event, button) => {
        const itemId = parseInt(button.getAttribute("data-id"));
	
		alert("removed! Item ID: " + itemId);
        removeFromCart(itemId);
    });
}

globalEventListener.add("click", ".fa-solid.fa-cart-shopping", (event, button) => {
    const itemId = parseInt(button.getAttribute("data-id"));
    
    // Redirect to the cart.html page
    window.location.href = "../pages/cart.html";
});

// Call showMenu when the DOM is fully loaded
globalEventListener.add("DOMContentLoaded", () => {
    //debug
    console.log("DOMContentLoaded event fired");
    showMenu();
});
