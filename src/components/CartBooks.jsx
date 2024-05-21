import React, { useEffect, useState } from 'react';
import { Table } from "antd";
import { Link } from "react-router-dom";
import { getCartItems } from "../service/cart";

const CartBooks = ({ onSelectedItemsChange }) => {
    const [cartData, setCartData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
        const fetchCartData = async () => {
            const items = await getCartItems();
            setCartData(items.map(item => ({
                ...item,
                key: item.id,
                number: item.quantity,
                book: {
                    ...item.book,
                    title: item.book.name,
                    price: item.price
                }
            })));
        };
        fetchCartData();
    }, []);

    const handleSelectChange = (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
        const selectedItems = cartData.filter(item => selectedRowKeys.includes(item.key));
        onSelectedItemsChange(selectedItems);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: handleSelectChange,
    };

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
                rowSelection={rowSelection}
                columns={columns}
                dataSource={cartData}
            />
        </div>
    );
};

export default CartBooks;
