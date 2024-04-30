import {getJson} from "./common";
export async function getOrders() {
    const url = `${process.env.REACT_APP_API_URL}/api/order/user/1`;
    console.log(`Full API URL: ${process.env.REACT_APP_API_URL}/api/order/user/1`);

    let orders;
    try {
        orders = await getJson(url);
        console.log("Orders received:", orders);
    } catch (e) {
        console.log(e);
        orders = []
    }
    return orders;
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