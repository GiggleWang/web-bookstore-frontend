import React, { useEffect, useState } from 'react';
import { Table, Button, message, Typography } from "antd";
import { Link } from "react-router-dom";
import { getCartItems } from "../service/cart";
import api from "../service/axios";

const { Text } = Typography;

const deleteCartItem = async (id) => {
    try {
        await api.delete(`${process.env.REACT_APP_API_URL}/api/cart/${id}`);
    } catch (error) {
        console.error('Error deleting cart item:', error);
        throw error;
    }
};

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

    const handleDelete = async (id) => {
        try {
            await deleteCartItem(id);
            setCartData(cartData.filter(item => item.id !== id));
            message.success('删除成功');
        } catch (error) {
            message.error('删除失败');
        }
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: handleSelectChange,
        getCheckboxProps: (record) => ({
            disabled: !record.book.active, // 如果active为false则禁用复选框
        }),
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
        {
            title: '状态',
            key: 'status',
            render: (text, record) => (
                !record.book.active
                    ? <Text type="danger">已经下架不能再购买</Text>
                    : null
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Button onClick={() => handleDelete(record.id)}>删除</Button>
            ),
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
