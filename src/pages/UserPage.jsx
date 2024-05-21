import React, {useState} from 'react';
import {Descriptions, Button, Modal, Form, Input} from 'antd';
import {userInfo, updateUserInfo} from "../service/data";
import AdminBooks from "../components/AdminBooks";
import MemberPage from "./MemberPage"; // 假设userInfo是初始用户信息

const UserPage = () => {
    const [user, setUser] = useState(userInfo[0]); // 假设userInfo是一个数组，我们取第一个用户
    const [isEditing, setIsEditing] = useState(false);
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSave = (values) => {
        const newUser = {...user, ...values};
        setUser(newUser);
        // 假设 updateUserInfo 能够直接更新 userInfo 数组
        updateUserInfo(0, newUser); // 这里的 0 是 userInfo[0] 的索引
        setIsEditing(false);
    };

    return (
        isAdmin ? (
                <div>
                    <MemberPage/>
                </div>
            ) :(
        <>
            <Descriptions
                title="个人信息"
                bordered
                column={{xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2}}
            >
                <Descriptions.Item label="姓名">{user.name}</Descriptions.Item>
                <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
                <Descriptions.Item label="余额">{user.balance}</Descriptions.Item>
                <Descriptions.Item label="用户等级">{user.level}</Descriptions.Item>
                <Descriptions.Item label="联系方式" span={2}>{user.contact}</Descriptions.Item>
                <Descriptions.Item label="个性化自述" span={2}>{user.bio}</Descriptions.Item>
            </Descriptions>
            <Button onClick={handleEdit} type="primary" style={{marginTop: 16}}>
                编辑信息
            </Button>

            <Modal
                title="编辑个人信息"
                visible={isEditing}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    initialValues={user}
                    onFinish={handleSave}
                >
                    <Form.Item
                        name="name"
                        label="姓名"
                        rules={[{required: true, message: '请输入姓名'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="contact"
                        label="联系方式"
                        rules={[{required: true, message: '请输入联系方式'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="bio"
                        label="个性化自述"
                        rules={[{required: true, message: '个性化自述'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            保存
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
        )
    );
};

export default UserPage;
