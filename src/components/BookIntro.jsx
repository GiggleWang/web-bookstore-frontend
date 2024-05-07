import React, { useEffect, useState } from 'react';
import { getBookById } from "../service/books";
import { Row, Col, Image, Typography, Divider, Space, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function BookIntro(props) {
    const [currentBook, setCurrentBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const bookId = props.bookId;

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

    function onAddCartItem(){
        console.log("add cart");
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: Could not fetch the book</p>;
    if (!currentBook) return <p>No book found!</p>;

    return (
        <Row gutter={16}>
            <Col span={9}>
                <Image
                    src={currentBook.cover}
                    height={500}
                    style={{ width: '100%', display: 'block' }}
                    alt="Book cover"
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
                                    <div style={{ color: '#dd3735', fontSize: '30px' }}>{(currentBook.price / 100).toFixed(2)}</div>
                                </Space>
                            </div>
                        </div>
                        <Space>
                            <Button size="large" onClick={onAddCartItem}>加入购物车</Button>
                            <Button type="primary" size="large">立即购买</Button>
                        </Space>
                    </Space>
                </Typography>
            </Col>
        </Row>
    );
}
