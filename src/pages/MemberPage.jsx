import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import api from "../service/axios";

const fetchUsers = async () => {
    try {
        const response = await api.get(`${process.env.REACT_APP_API_URL}/api/admin/users`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

const updateUserStatus = async (userId, action) => {
    try {
        await api.post(`${process.env.REACT_APP_API_URL}/api/admin/${action}/${userId}`);
        message.success(`User ${action === 'disable' ? 'disabled' : 'enabled'} successfully`);
    } catch (error) {
        console.error(`Error ${action === 'disable' ? 'disabling' : 'enabling'} user:`, error);
        message.error(`Error ${action === 'disable' ? 'disabling' : 'enabling'} user`);
    }
};

const MemberPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchUsers();
                setUsers(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDisableUser = async (userId) => {
        await updateUserStatus(userId, 'disable');
        setUsers(users.map(user => (user.id === userId ? { ...user, disabled: true } : user)));
    };

    const handleEnableUser = async (userId) => {
        await updateUserStatus(userId, 'enable');
        setUsers(users.map(user => (user.id === userId ? { ...user, disabled: false } : user)));
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '状态',
            dataIndex: 'disabled',
            key: 'disabled',
            render: (text) => (text ? '禁用' : '启用'),
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    {record.disabled ? (
                        <Button onClick={() => handleEnableUser(record.id)}>启用</Button>
                    ) : (
                        <Button onClick={() => handleDisableUser(record.id)}>禁用</Button>
                    )}
                </span>
            ),
        },
    ];

    return (
        <div>
            <h1>用户管理</h1>
            <Table columns={columns} dataSource={users} rowKey="id" loading={loading} />
        </div>
    );
};

export default MemberPage;
