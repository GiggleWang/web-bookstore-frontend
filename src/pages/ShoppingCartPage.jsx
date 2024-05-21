import React, {useEffect, useState} from 'react';
import CartBooks from "../components/CartBooks";
import {Input, Row, Statistic, Button, message, Form} from 'antd';
import api from "../service/axios";
import { useNavigate } from 'react-router-dom';
import { Modal} from 'antd';

const {Search} = Input;

const onSearch = (value, _e, info) => {
    console.log(info?.source, value);
};

const ShoppingCartPage = () => {

    const [selectedItems, setSelectedItems] = useState([]);
    const [totalPrice,setTotalPrice] = useState(0);
    const handleSelectedItems = (items) => {
        setSelectedItems(items);
    };
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = () => {
        form
            .validateFields()
            .then(values => {
                // 从表单获取收件人和地址
                const { address, receiver } = values;

                // 构造要发送的订单数据
                const orderData = {
                    address: address,
                    receiver: receiver,
                    items: selectedItems.map(item => ({
                        bookId: item.bookId, // 确保这里的id对应你的数据结构
                        quantity: item.quantity
                    }))
                };
                console.log(orderData);

                // 使用api发送POST请求
                const url = `${process.env.REACT_APP_API_URL}/api/order`;
                api.post(url, orderData)
                    .then(response => {
                        if (response.status === 200) {
                            message.success('订单已成功提交');
                            form.resetFields();
                            setIsModalVisible(false);
                        } else {
                            throw new Error('提交订单失败');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        message.error('提交订单失败');
                    });
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    useEffect(() => {
        console.log("Selected items after update:", selectedItems);

        // 计算总价格并除以100，然后取两位小数，保持为字符串格式
        const total = selectedItems.reduce((acc, item) => acc + item.price, 0) / 100;
        setTotalPrice(total.toFixed(2));  // 直接保持为字符串

    }, [selectedItems]); // 依赖列表中的 selectedItems 表示此 useEffect 会在 selectedItems 更新后运行

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
            <CartBooks onSelectedItemsChange={handleSelectedItems}/>
            <Statistic title="Total Price" value={totalPrice}/>
            <Row gutter={16} justify="space-evenly">
                <Button onClick={handleClearCart} className="custom-clear-cart-button">
                    清空购物车
                </Button>
                <Button onClick={showModal} className="custom-place-order-button">
                    现在下单
                </Button>

            </Row>
            <Modal title="输入订单详情" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="receiver"
                        label="收件人"
                        rules={[{ required: true, message: '请输入收件人姓名!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="地址"
                        rules={[{ required: true, message: '请输入收货地址!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>


        </div>
    );
};

export default ShoppingCartPage;