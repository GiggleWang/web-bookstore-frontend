import React, { useEffect, useState } from 'react';
import { Table } from "antd";
import { Link } from "react-router-dom";
import { getCartItems } from "../service/cart";
const CartBooks = () => {
    const [cartData, setCartData] = useState([]);

    useEffect(() => {
        const fetchCartData = async () => {
            const items = await getCartItems();
            setCartData(items.map(item => ({
                ...item,
                key: item.id,
                number: item.quantity,  // 映射quantity为number用于表格显示
                book: {
                    ...item.book,
                    title: item.book.name,  // 将name映射为title以符合列定义
                    price: item.price  // 使用外层的总价格
                }
            })));
        };
        fetchCartData();
    }, []);

    const columns = [
        {
            title: '书名',
            dataIndex: 'book',
            key: 'book_title',
            render: book => <Link to={`/book/${book.id}`}>{book.title}</Link>
        },
        {
            title: '数量',
            dataIndex: 'number',
            key: 'number',
            render: number => <span>{number}</span>
        },
        {
            title: '价格',
            dataIndex: 'book',
            key: 'book_price',
            render: book => `${(book.price / 100).toFixed(2)} 元`
        },
    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={cartData}
            />
        </div>
    );
};

export default CartBooks;
