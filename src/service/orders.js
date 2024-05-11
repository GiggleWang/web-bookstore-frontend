
import api from "./axios";

export async function getOrders() {
    const url = `${process.env.REACT_APP_API_URL}/api/order`;
    console.log(`Full API URL: ${url}`);

    try {
        const response = await api.get(url);
        console.log("Orders received:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

export function getTime(time) {
    let date = new Date(time);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
}