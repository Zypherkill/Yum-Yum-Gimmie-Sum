export async function getProducts() {
	try {
		const productResponse = await fetch ('https://santosnr6.github.io/Data/yumyumproducts.json');
		if (!productResponse.ok) {
			throw new Error(`HTTP error: ${productResponse.status}`);
		}
		const productData = await productResponse.json();
		return productData.items;
	} catch (error) {
		console.error("Error fetching products:", error);
		return null;
	}
}

export async function getUsers() {
    try {
        const userResponse = await fetch('https://santosnr6.github.io/Data/yumyumusers.json');
        if (!userResponse.ok) {
            throw new Error(`HTTP error: ${userResponse.status}`);
        }
        const userData = await userResponse.json();
        if (userData && userData.users && Array.isArray(userData.users)) {
            console.log(userData); // For debugging
            return userData;
        } else {
            throw new Error("Invalid data format received from API");
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        return null;

        
    }
    
}
