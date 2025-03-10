import { getProducts } from "../modules/api.js";

export async function showMenu() {
	const productData = await getProducts();
	const wrapperRef = document.querySelector('#menu-wrapper');

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
		const itemName = document.createElement('h2');
		itemName.textContent = item.name;

		const itemIngredients = document.createElement('p');
		itemIngredients.textContent = item.itemIngredients;

		const itemPrice = document.createElement('p');
		itemPrice.textContent = item.price;

		const plusButton = document.createElement('i');
		plusButton.classList.add('fa-solid', 'fa-circle-plus');

		const minusButton = document.createElement('i');
		minusButton.classList.add('fa-solid', 'fa-circle-minus')


		menuRef.appendChild(itemName);
		menuRef.appendChild(itemIngredients);
		menuRef.appendChild(itemPrice);
		menuRef.appendChild(minusButton);
		menuRef.appendChild(plusButton);

		wrapperRef.appendChild(menuRef);
	})
}