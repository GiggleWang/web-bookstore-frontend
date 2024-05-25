import React, { useEffect, useState } from 'react';
import CartBooks from "../components/CartBooks";
import { Input, Row, Statistic, Button, message, Form } from 'antd';
import api from "../service/axios";
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';

const ShoppingCartPage = () => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleSelectedItems = (items) => {
        setSelectedItems(items);
    };

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
                const { address, receiver } = values;
                const orderData = {
                    address: address,
                    receiver: receiver,
                    items: selectedItems.map(item => ({
                        bookId: item.bookId,
                        quantity: item.quantity
                    }))
                };

                const url = `${process.env.REACT_APP_API_URL}/api/order`;
                api.post(url, orderData)
                    .then(response => {
                        if (response.status === 200) {
                            message.success('订单已成功提交');
                            form.resetFields();
                            setIsModalVisible(false);
                            deleteCartItems();
                        } else {
                            throw new Error('提交订单失败');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        if (error.response && error.response.data) {
                            message.error(`提交订单失败: ${error.response.data}`);
                        } else {
                            message.error('提交订单失败');
                        }
                    });
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const deleteCartItems = async () => {
        for (const item of selectedItems) {
            const deleteUrl = `${process.env.REACT_APP_API_URL}/api/cart/${item.id}`;
            try {
                const deleteResponse = await api.delete(deleteUrl);
                if (deleteResponse.status === 200) {
                    // message.success(`购物车项 ${item.id} 已成功删除`);
                    navigate('/orders');
                } else {
                    throw new Error('删除购物车项失败');
                }
            } catch (deleteError) {
                console.error('Error:', deleteError);
                message.error(`删除购物车项 ${item.id} 失败`);
            }
        }
    };

    useEffect(() => {
        console.log("Selected items after update:", selectedItems);
        const total = selectedItems.reduce((acc, item) => acc + item.price, 0) / 100;
        setTotalPrice(total.toFixed(2));
    }, [selectedItems]);

    const handleClearCart = () => {
        console.log('清空购物车');
        const url = `${process.env.REACT_APP_API_URL}/api/cart/clean`;

        api.post(url)
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    message.success('购物车删除成功');
                    navigate('/home');
                    setTimeout(() => {
                        navigate(-1);
                    }, 0);
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
            <CartBooks onSelectedItemsChange={handleSelectedItems} />
            <Statistic title="Total Price" value={totalPrice} />
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
