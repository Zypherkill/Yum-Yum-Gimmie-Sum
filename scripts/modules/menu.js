import { getProducts } from "../modules/api.js";

export async function showMenu() {
	const productData = await getProducts();
	const wrapperRef = document.querySelector('.menu-wrapper');

	// Skapar en sektion som håller texten "Meny" samt en ikon för att filtrera
	const headerRef = document.createElement('section');
	headerRef.classList.add('menu-header')

	const headerText = document.createElement('h1');
	headerText.textContent = "Meny";

	const filterIcon = document.createElement('i');
	filterIcon.classList.add('fa-solid', 'fa-filter')

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

		const minusButton = document.createElement('i');
		minusButton.classList.add('fa-solid', 'fa-circle-minus')

		menuRef.appendChild(menuItem);
		menuItem.appendChild(itemName);
		menuItem.appendChild(itemIngredients);
		menuItem.appendChild(itemPrice);
		menuItem.appendChild(minusButton);
		menuItem.appendChild(plusButton);
		wrapperRef.appendChild(menuRef);
	})
}