import api from "./axios";
import {message} from "antd";

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

export async function onAddCartItem(id, quantity) {
    try {
        const response = await api.post(`${process.env.REACT_APP_API_URL}/api/cart`, {
            bookId: id, // 使用传递给函数的id
            quantity: quantity || 1, // 使用传递给函数的quantity，如果没有提供，默认为1
        });

        if (response.status === 200) {
            console.log('Book added to cart:', response.data);
            // 在这里添加逻辑，比如更新购物车视图或提示用户
            message.success('加入购物车成功');
        } else {
            throw new Error('Failed to add book to cart');
        }
    } catch (error) {
        console.error('Error adding book to cart:', error);
        // 在这里添加错误处理逻辑，比如提示用户添加失败
    }
}


