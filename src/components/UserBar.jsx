import React, { useCallback } from 'react';
import { Button,Space } from 'antd';
import { useNavigate } from "react-router-dom";
import api from "../service/axios";
const UserBar = () => {
    const navigate = useNavigate();



    const handleLogout = useCallback(() => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isAdmin');
        api.get(`${process.env.REACT_APP_API_URL}/api/logout`)
        navigate('/');
    }, [navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
                <Button  onClick={handleLogout}>
                    登出
                </Button>
            </Space>
        </div>
    );
};

export default UserBar;
