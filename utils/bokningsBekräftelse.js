import { getProducts, getUsers } from "../scripts/modules/api"

export async function sendBookingRequest(orderDetails, endpoint) {
    try {
        // Fetch user/product details
        const user = await getUsers();
        const product = await getProducts();


        // Merge getProducts/getUsers into a bookingrequest
        const userBookingRequest = {
            ...orderDetails,
            userId: user.id,
            userName: user.name,
            email: user.email,

            itemId: product.id,
            itemName: product.name, 
            itemPrice: product.price

        };

        // Save in localStorage before sending a booking Request
        localStorage.setItem("pågåendeBokning", JSON.stringify(userBookingRequest));

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userBookingRequest)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Clear pendingBooking from localstorage (eller? skall vi ha kvar den?)
        localStorage.removeItem("pågåendeBokning");

        return data;
    } catch (error) {
        console.error("Booking request failed:", error);
        throw error; 
    }
}

//get stored booking details
export function getStoredBooking() {
    const storedRequest = localStorage.getItem("pendingBooking");
    return storedRequest ? JSON.parse(storedRequest) : null; //if no booking is found return null
}


