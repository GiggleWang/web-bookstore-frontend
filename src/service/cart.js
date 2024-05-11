import api from "./axios";

export async function getCartItems() {
    const url = `${process.env.REACT_APP_API_URL}/api/cart`;
    console.log(`Full API URL: ${url}`);

    try {
        const response = await api.get(url);
        console.log("CartItems received:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching cartItems:', error);
        return [];
    }
}