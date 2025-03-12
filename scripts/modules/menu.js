import { getProducts } from "../modules/api.js";

export async function showMenu() {
    const productData = await getProducts();
    const wrapperRef = document.querySelector(".menu-wrapper");

    // Skapar en sektion som håller texten "Meny" samt en ikon för att filtrera
    const headerRef = document.createElement("section");
    headerRef.classList.add("menu-header");

    const headerText = document.createElement("h1");
    headerText.textContent = "Meny";

    const filterIcon = document.createElement("i");
    filterIcon.classList.add("fa-solid", "fa-filter");

    headerRef.appendChild(headerText);
    headerRef.appendChild(filterIcon);

    wrapperRef.appendChild(headerRef);

    // Skapar dropdown-menyn för filtrering
    const filterSelect = document.createElement("select");
    filterSelect.classList.add("filter-dropdown");
    filterSelect.style.display = "none";
    filterSelect.addEventListener("change", (event) => {
        filterMenu(event.target.value);
    });

    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = "All";
    filterSelect.appendChild(allOption);

    const types = [...new Set(productData.map((item) => item.type))];
    types.forEach((type) => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        filterSelect.appendChild(option);
    });

    wrapperRef.appendChild(filterSelect);

    //Eventlyssnare på filterikonen för att visa/gömma dropdown-menyn
    filterIcon.addEventListener("click", () => {
        filterSelect.style.display =
            filterSelect.style.display === "none" ? "block" : "none";
    });

    // Populerar menyn med rätterna
    const menuRef = document.createElement("section");
    menuRef.classList.add("menu-items");

    function renderMenu(items) {
        menuRef.innerHTML = ""; // Rensa tidigare meny
        items.forEach((item) => {
            const menuItem = document.createElement("article");
            menuItem.classList.add("menu-item");
            const itemName = document.createElement("h2");
            itemName.textContent = item.name;
            itemName.classList.add("menu-title");

            const itemIngredients = document.createElement("p");
            if (
                Array.isArray(item.ingredients) &&
                item.ingredients.length > 0
            ) {
                itemIngredients.textContent = item.ingredients.join(", ");
            } else {
                itemIngredients.textContent = "";
            }
            itemIngredients.classList.add("menu-ingredients");

            const itemPrice = document.createElement("p");
            itemPrice.textContent = `${item.price} sek`;
            itemPrice.classList.add("menu-price");

            const plusButton = document.createElement("i");
            plusButton.classList.add("fa-solid", "fa-circle-plus");

            const minusButton = document.createElement("i");
            minusButton.classList.add("fa-solid", "fa-circle-minus");

            menuItem.appendChild(itemName);
            menuItem.appendChild(itemIngredients);
            menuItem.appendChild(itemPrice);
            menuItem.appendChild(minusButton);
            menuItem.appendChild(plusButton);
            menuRef.appendChild(menuItem);
        });
        wrapperRef.appendChild(menuRef);
    }

    renderMenu(productData);

    function filterMenu(type) {
        // Filtrera produktdata baserat på typ
        const filteredData = type
            ? productData.filter((item) => item.type === type)
            : productData;
        renderMenu(filteredData);
    }
}
