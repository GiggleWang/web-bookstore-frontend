import React, { useEffect, useState } from 'react';
import {Input, Button, DatePicker, Card, Table, Pagination, List, Avatar} from "antd";
import { getOrders } from "../service/orders";
import { getTime } from "../service/orders";

const { RangePicker } = DatePicker;

function OrdersExhibition() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 10;
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    useEffect(() => {
        let filters = {
            bookName: searchTerm,
            startDate: undefined,
            endDate: undefined
        };

        if (dateRange.length === 2) {
            filters.startDate = dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : undefined;
            filters.endDate = dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : undefined;
        }

        fetchOrders(filters);
    }, [searchTerm, dateRange, currentPage]);



    const fetchOrders = async (filters) => {
        const params = {
            page: currentPage - 1, // 页面索引在后端从0开始
            size: pageSize,
            bookName: filters.bookName || '',  // 如果没有书名，显式发送 null
            startDate: filters.startDate || '', // 如果没有开始日期，显式发送 null
            endDate: filters.endDate || '', // 如果没有结束日期，显式发送 null
        };
        try {
            console.log("startdate"+filters.startDate);
            const response = await getOrders(params);
            setOrders(response.orders);
            setTotalItems(response.totalItems);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            // Optionally handle errors in UI
        }
    };


    const handleSearch = (value) => {
        setCurrentPage(1);
        setSearchTerm(value);
    };

    const tableColumns = [
        { title: '收件人', dataIndex: 'receiver', key: 'receiver' },
        { title: '地址', dataIndex: 'shippingAddress', key: 'shippingAddress' },
        { title: '总金额', dataIndex: 'totalPrice', key: 'totalPrice', render: (value) => `¥${(value / 100).toFixed(2)}` },
        { title: '订单时间', dataIndex: 'orderDate', key: 'orderDate', render: (timestamp) => getTime(timestamp) }
    ];

    if (isAdmin) {
        tableColumns.unshift({ title: '用户id', dataIndex: 'userId', key: 'userId' });  // Add user ID column for admins
    }

    return (
        <Card className="card-container">
            <div style={{ marginBottom: '16px' }}>
                <Input.Search
                    placeholder="搜索书籍名称"
                    onSearch={handleSearch}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ width: '200px', marginRight: '8px' }}
                />
                <RangePicker
                    onChange={dates => setDateRange(dates || [])}  // 确保dateRange不会是null
                    style={{ marginRight: '8px' }}
                />

                <Button type="primary" onClick={() => handleSearch(searchTerm)}>搜索</Button>
            </div>
            <Table
                columns={tableColumns}
                expandable={{
                    expandedRowRender: record => (
                        <List
                            dataSource={record.items} // 假设每个订单记录中都有一个 items 属性
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar shape="square" size={80} src={item.book.cover} />}
                                        title={item.book.name}
                                        description={`数量：${item.quantity}`}
                                    />
                                </List.Item>
                            )}
                        />
                    )
                }}
                dataSource={orders.map(order => ({ ...order, key: order.id }))}
                pagination={false}
            />

            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalItems}
                onChange={page => setCurrentPage(page)}
                style={{ marginTop: '16px' }}
            />
        </Card>
    );
}

export default OrdersExhibition;
