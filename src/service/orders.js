
import api from "./axios";
export async function getOrders(filterParams = {}) {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    let url;
    if (isAdmin) {
        url = `${process.env.REACT_APP_API_URL}/api/admin/order`;
    } else {
        url = `${process.env.REACT_APP_API_URL}/api/order`;
    }

    // 将分页参数正确设置并添加到查询字符串中
    const params = {
        ...filterParams
    };
    const queryString = new URLSearchParams(params).toString();
    url += `?${queryString}`;

    console.log(`Full API URL: ${url}`);

    try {
        const response = await api.get(url);
        console.log("Orders received:", response.data);
        return {
            orders: response.data.orders,
            totalItems: response.data.totalItems,
            totalPages: response.data.totalPages,  // 也可以获取总页数
            currentPage: response.data.currentPage // 获取当前页，以保持前后端同步
        };
    } catch (error) {
        console.error('Error fetching orders:', error);
        return { orders: [], totalItems: 0, totalPages: 0, currentPage: 1 };
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