import {cartBookData} from "../service/data";
import React, {useState} from 'react';
import {Table, InputNumber} from 'antd';
import {Button} from "antd";
import {Link} from "react-router-dom";

const columns = [
    {
        title: '书名', dataIndex: 'book', key: 'book_title',
        render: book => (<Link to={`/book/${book.id}`}>{book.title}</Link>),
    },
    {
        title: '数量', dataIndex: 'number', key: 'number',
        render: (number, item) => <InputNumber min={1} defaultValue={number} value={item.value}
                                               onChange={(newNumber) => {
                                                   console.log('change number')
                                               }}/>
    },
    {
        title: '价格', dataIndex: 'book', key: 'book_price',
        render: book => book.price / 100
    },
    {
        title: '操作',
        dataIndex: '',
        key: 'action',
        render: (item) => <Button type="primary" onClick={() => {
            console.log('删除图书')
        }}>删除</Button>,
    },
];
const data = cartBookData;

const CartBooks = (props) => {

// rowSelection object indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            // 调用传入的回调函数，以选中行的数据为参数
            if (props.onBookSelection) {
                props.onBookSelection(selectedRows);
            }
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };
    return (
        <div>
            <Table
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={data}
            />
        </div>
    );
};
export default CartBooks;
