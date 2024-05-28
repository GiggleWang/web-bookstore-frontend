import React, { useEffect, useState } from 'react';
import { Descriptions } from 'antd';
import { getUserInfo } from '../service/user';
import '../css/user.css';
import MemberPage from "./MemberPage"; // 引入自定义的CSS样式

const UserPage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    useEffect(() => {
        const fetchUserInfo = async () => {
            const data = await getUserInfo();
            setUserInfo(data);
        };

        fetchUserInfo();
    }, []);

    if (!userInfo) {
        return <div>加载中...</div>;
    }

    let userType = (userInfo.type===0)?"普通用户":"管理员";

    return (
        isAdmin?(<MemberPage/>)
            :
        <div className="user-page">
            <h1>用户信息</h1>
            <Descriptions bordered>
                <Descriptions.Item label="ID">{userInfo.id}</Descriptions.Item>
                <Descriptions.Item label="姓名">{userInfo.name}</Descriptions.Item>
                <Descriptions.Item label="地址">{userInfo.address}</Descriptions.Item>
                <Descriptions.Item label="电话">{userInfo.telephone}</Descriptions.Item>
                <Descriptions.Item label="类型">{userType}</Descriptions.Item>
                <Descriptions.Item label="电子邮件">{userInfo.email}</Descriptions.Item>
            </Descriptions>
        </div>
    );
};

export default UserPage;
