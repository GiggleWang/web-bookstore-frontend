import React, { useEffect, useState } from 'react';
import { Card, Table, DatePicker, Button, Typography } from 'antd';
import { Bar } from '@ant-design/plots';
import api from '../service/axios';  // 确保已经配置好 api.js
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

export default function UserRanking() {
    const [statistics, setStatistics] = useState(null);
    const [dateRange, setDateRange] = useState([]);

    const fetchUserPurchaseStatistics = async (startDate, endDate) => {
        const url = `/api/user/statistics/purchase?startDate=${startDate}&endDate=${endDate}`;
        const response = await api.get(url);
        setStatistics(response.data);
    };

    const handleSearch = () => {
        if (dateRange && dateRange.length === 2) {
            const startDate = dateRange[0].format('YYYY-MM-DD');
            const endDate = dateRange[1].format('YYYY-MM-DD');
            fetchUserPurchaseStatistics(startDate, endDate);
        }
    };

    useEffect(() => {
        if (dateRange && dateRange.length === 2) {
            handleSearch();
        }
    }, [dateRange]);

    const columns = [
        {
            title: '书名',
            dataIndex: 'bookName',
            key: 'bookName',
        },
        {
            title: '购买数量',
            dataIndex: 'quantity',
            key: 'quantity',
            sorter: (a, b) => b.quantity - a.quantity,
        },
    ];

    const dataSource = statistics ? Object.keys(statistics.bookQuantityMap).map(bookName => ({
        bookName,
        quantity: statistics.bookQuantityMap[bookName],
    })) : [];

    const barConfig = {
        data: dataSource,
        xField: 'bookName',
        yField: 'quantity',
        seriesField: 'bookName',
        legend: {
            position: 'top-left',
        },
        meta: {
            quantity: { alias: '购买数量' },
            bookName: { alias: '书名' },
        },
        isVertical: true, // 确保柱状图是竖直的
    };

    return (
        <div>
            <Title level={2}>购买统计</Title>
            <RangePicker onChange={(dates) => setDateRange(dates)} style={{ marginBottom: '16px' }} />
            <Button type="primary" onClick={handleSearch} style={{ marginLeft: '8px' }}>搜索</Button>
            {statistics && (
                <Card title="统计结果" style={{ marginTop: '16px' }}>
                    <Bar {...barConfig} style={{ marginBottom: '16px' }} />
                    <Table columns={columns} dataSource={dataSource} rowKey="bookName" pagination={false} />
                    <div style={{ marginTop: '16px' }}>
                        <Text>总购买数量: {statistics.totalBooks}</Text><br />
                        <Text>总花费金额: ¥{(statistics.totalAmount / 100).toFixed(2)}</Text>
                    </div>
                </Card>
            )}
        </div>
    );
}
