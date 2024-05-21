import React, { useEffect, useState } from 'react';
import { getBookById } from "../service/books";
import { Row, Col, Image, Typography, Divider, Space, Button, InputNumber, Form, Input, Modal, message } from 'antd';
import { onAddCartItem } from "../service/cart";
import api from "../service/axios";

const { Title, Paragraph } = Typography;

export default function BookIntro(props) {
    const [currentBook, setCurrentBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const bookId = props.bookId;
    const [quantity, setQuantity] = useState(1); // 默认数量为1
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
                const { address, receiver } = values;

                const orderData = {
                    address: address,
                    receiver: receiver,
                    items: [{
                        bookId: bookId,
                        quantity: quantity
                    }]
                };

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
        setLoading(true);
        getBookById(bookId).then(book => {
            setCurrentBook(book);
            setLoading(false);
        }).catch(err => {
            console.error("Error fetching book: ", err);
            setError(err);
            setLoading(false);
        });
    }, [bookId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: Could not fetch the book</p>;
    if (!currentBook) return <p>No book found!</p>;

    return (
        <div>
            <Row gutter={16}>
                <Col span={9}>
                    <Image
                        src={currentBook.cover}
                        height={500}
                        style={{ width: '100%', display: 'block' }}
                        alt={currentBook.title}
                    />
                </Col>
                <Col span={15}>
                    <Typography>
                        <Title level={3}>{currentBook.name}</Title>
                        <Divider orientation="left">基本信息</Divider>
                        <Space direction="vertical" size="middle">
                            <Paragraph>
                                {`作者：${currentBook.author}`}
                                <Divider type="vertical" />
                                {`销量：${currentBook.sales}`}
                            </Paragraph>
                        </Space>
                        <Divider orientation="left">作品简介</Divider>
                        <Paragraph>
                            {currentBook.description}
                        </Paragraph>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div style={{ backgroundColor: '#fcfaf7', padding: '20px', borderRadius: '4px' }}>
                                <Paragraph style={{ marginBottom: 0 }} type="secondary">促销价</Paragraph>
                                <div>
                                    <Space>
                                        <div style={{ color: '#dd3735', fontSize: '16px' }}>¥</div>
                                        <div style={{
                                            color: '#dd3735',
                                            fontSize: '30px'
                                        }}>{(currentBook.price / 100).toFixed(2)}</div>
                                    </Space>
                                </div>
                            </div>
                            <div>
                                <h5>购买数量:</h5>
                                <InputNumber min={1} defaultValue={1} onChange={setQuantity} />
                            </div>

                            <Space>
                                <Button size="large" onClick={() => onAddCartItem(currentBook.id, quantity)}>加入购物车</Button>
                                <Button onClick={showModal} type="primary" size="large">立即购买</Button>
                            </Space>
                        </Space>
                    </Typography>
                </Col>
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
}
