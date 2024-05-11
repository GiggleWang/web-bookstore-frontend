import React, {useState} from 'react';
import CartBooks from "../components/CartBooks";
import {Input, Statistic, Row, Button, message} from 'antd';
import {cartBookData} from "../service/data";
import api from "../service/axios";
import { useNavigate } from 'react-router-dom';

const {Search} = Input;

const onSearch = (value, _e, info) => {
    console.log(info?.source, value);
};

const handlePlaceOrder = () => {
    console.log('现在下单');
    // 下单的具体逻辑
    // 假设你有一个名为 orderData 的对象，其中包含了订单的信息
    const orderData = cartBookData;

// 发送 POST 请求到后端
    const url = `${process.env.REACT_APP_API_URL}/api/order/user/1`;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to send order data');
            }
            return response.json();
        })
        .then(data => {
            console.log('Order confirmation:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

};

const ShoppingCartPage = () => {
    const navigate = useNavigate();
    const handleClearCart = () => {

        console.log('清空购物车');
        const url = `${process.env.REACT_APP_API_URL}/api/cart/clean`; // 后端提供的清空购物车的API路径

        api.post(url)
            .then(response => {
                console.log(response);
                if (response.status===200) {
                    message.success('购物车删除成功');
                    navigate('/home'); // 导航到 '/home' 路由
                    setTimeout(() => {
                        navigate(-1); // 使用浏览器的后退功能回到上一个页面
                    }, 0); // 延迟执行，以确保先完成页面跳转
                } else {
                    message.error('购物车删除失败');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                message.error('购物车删除失败');
            });
    };
    const [totalPrice, setTotalPrice] = useState(0);

    const handleBookSelection = (selectedBooks) => {
        let total = 0;
        selectedBooks.forEach(item => {
            // 确保价格转换为元（如果以分为单位）并转换为数字类型
            // 确保数量也转换为数字类型
            const pricePerBook = item.book.price / 100; // 根据实际路径调整
            const quantity = item.number; // 假设`number`字段存储了数量
            total += pricePerBook * quantity; // 价格乘以数量
        });
        setTotalPrice(total);
    };


    return (
        <div>
            <Search
                placeholder="输入图书名称"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={onSearch}
                style={{marginBottom: '20px'}}
            />
            <CartBooks onBookSelection={handleBookSelection}/>
            <Statistic title="Total Price" value={totalPrice}/>
            <Row gutter={16} justify="space-evenly">
                <Button onClick={handleClearCart} className="custom-clear-cart-button">
                    清空购物车
                </Button>
                <Button onClick={handlePlaceOrder} className="custom-clear-cart-button">
                    现在下单
                </Button>
            </Row>

        </div>
    );
};

export default ShoppingCartPage;