import React, { useEffect, useState } from 'react';
import { Input, Button, DatePicker, Card, Table, Pagination } from "antd";
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
        const filters = {
            bookName: searchTerm,
            startDate: dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : undefined,
            endDate: dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : undefined
        };
        fetchOrders(filters);
    }, [searchTerm, dateRange, currentPage]);

    const fetchOrders = async (filters) => {
        const params = {
            page: currentPage - 1, // Page index starts from 0 in the backend
            size: pageSize,
            ...filters
        };
        try {
            const response = await getOrders(params);
            setOrders(response.orders);
            setTotalItems(response.totalItems);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            // Optionally handle errors in UI
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page
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
                    onChange={dates => setDateRange(dates)}
                    style={{ marginRight: '8px' }}
                />
                <Button type="primary" onClick={() => handleSearch(searchTerm)}>搜索</Button>
            </div>
            <Table
                columns={tableColumns}
                dataSource={orders.map(order => ({ ...order, key: order.id }))}
                pagination={false} // Disable internal pagination
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
