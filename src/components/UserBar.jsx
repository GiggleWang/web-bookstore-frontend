import React, { useCallback, useMemo } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, message, Space } from 'antd';
import { userInfo } from "../service/data";
import { useNavigate } from "react-router-dom";

const UserBar = () => {
    const navigate = useNavigate();
    const userName = userInfo[0].name;

    const onClick = useCallback(({ key }) => {
        if (key === '3') {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('isAdmin')

            navigate('/');
        } else {
            message.info(`Click on item ${key}`);
        }
    }, [navigate]);

    const items = useMemo(() => [
        {
            label: '修改密码',
            key: '1',
        },
        {
            label: `余额 : ${userInfo[0].balance}`,
            key: '2',
        },
        {
            label: '登出',
            key: '3',
        },
    ], []);

    return (
        <Dropdown menu={{ items, onClick }}>
            <a onClick={(e) => e.preventDefault()}>
                <Space>
                    Hello, {userName}
                    <DownOutlined />
                </Space>
            </a>
        </Dropdown>
    );
};

export default UserBar;
