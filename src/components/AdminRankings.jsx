import React, { useEffect, useState } from 'react';
import { Card, Table, DatePicker, Button } from 'antd';
import { Bar } from '@ant-design/plots';
import api from '../service/axios';  // 确保已经配置好 api.js
const { RangePicker } = DatePicker;

export default function AdminRankings() {
    const [salesData, setSalesData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [view, setView] = useState('sales'); // "sales" or "users"

    const fetchSalesData = async (startDate, endDate) => {
        const url = `/api/admin/statistics/sales?startDate=${startDate}&endDate=${endDate}`;
        const response = await api.get(url);
        const data = response.data.map(item => ({
            ...item,
            sales: item.sales !== null ? item.sales : 0, // 确保没有null值
        }));
        console.log("Sales Data:", data); // 打印调试信息
        setSalesData(data);
    };

    const fetchUserData = async (startDate, endDate) => {
        const url = `/api/admin/statistics/users?startDate=${startDate}&endDate=${endDate}`;
        const response = await api.get(url);
        const data = response.data.map(item => ({
            ...item,
            totalPurchase: item.totalPurchase !== null ? item.totalPurchase / 100 : 0, // 从分转换为元并确保没有null值
        }));
        console.log("User Data:", data); // 打印调试信息
        setUserData(data);
    };

    const handleSearch = () => {
        if (dateRange && dateRange.length === 2) {
            const startDate = dateRange[0].format('YYYY-MM-DD');
            const endDate = dateRange[1].format('YYYY-MM-DD');
            fetchSalesData(startDate, endDate);
            fetchUserData(startDate, endDate);
        }
    };

    useEffect(() => {
        if (dateRange && dateRange.length === 2) {
            handleSearch();
        }
    }, [dateRange]);

    const salesColumns = [
        {
            title: '书名',
            dataIndex: 'bookName',
            key: 'bookName',
        },
        {
            title: '销售量',
            dataIndex: 'sales',
            key: 'sales',
            sorter: (a, b) => b.sales - a.sales,
        },
    ];

    const userColumns = [
        {
            title: '用户ID',
            dataIndex: 'userId',
            key: 'userId',
        },
        {
            title: '总购买金额（元）',
            dataIndex: 'totalPurchase',
            key: 'totalPurchase',
            sorter: (a, b) => b.totalPurchase - a.totalPurchase,
        },
    ];

    const salesChartConfig = {
        data: salesData,
        xField: 'bookName',
        yField: 'sales',
        label: {
            style: {
                fill: '#aaa',
            },
        },
        tooltip: {
            formatter: datum => ({
                name: '销售量',
                value: datum.sales !== null ? datum.sales : '无数据'
            }),
            title: datum => datum.bookName || '未知书名',
            showMarkers: false,
        },
    };

    const userChartConfig = {
        data: userData,
        xField: 'userId',
        yField: 'totalPurchase',
        label: {
            style: {
                fill: '#aaa',
            },
        },
        tooltip: {
            formatter: datum => ({
                name: '总购买金额（元）',
                value: datum.totalPurchase !== null ? datum.totalPurchase : '无数据'
            }),
            title: datum => datum.userId || '未知用户ID',
            showMarkers: false,
        },
        xAxis: {
            type: 'category',
            label: {
                formatter: val => parseInt(val, 10).toString(), // 确保X轴只显示整数
            },
        },
    };

    return (
        <div>
            <h1>统计信息</h1>
            <RangePicker onChange={(dates) => setDateRange(dates)} style={{ marginBottom: '16px' }} />
            <Button type="primary" onClick={handleSearch} style={{ marginLeft: '8px' }}>搜索</Button>
            <Button
                type="default"
                onClick={() => setView(view === 'sales' ? 'users' : 'sales')}
                style={{ marginLeft: '8px' }}
            >
                {view === 'sales' ? '查看用户购买排名' : '查看销售排名'}
            </Button>
            {view === 'sales' ? (
                <Card title="销售排名" style={{ marginTop: '16px' }}>
                    <Bar {...salesChartConfig} />
                    <Table columns={salesColumns} dataSource={salesData} rowKey="bookName" pagination={false} />
                </Card>
            ) : (
                <Card title="用户购买排名" style={{ marginTop: '16px' }}>
                    <Bar {...userChartConfig} />
                    <Table columns={userColumns} dataSource={userData} rowKey="userId" pagination={false} />
                </Card>
            )}
        </div>
    );
}
