import api from "./axios";
export async function getUserInfo() {
    const url=`${process.env.REACT_APP_API_URL}/api/user/me`
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

export async function getUserName() {
    const url = `${process.env.REACT_APP_API_URL}/api/user/me`
    try {
        const response = await api.get(url);
        return response.data.name;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}