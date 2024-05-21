import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import "../css/login.css";
import RegisterModal from '../components/RegisterModal';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const url = `${process.env.REACT_APP_API_URL}/api/login`;
            console.log(url);
            const response = await axios.post(url, {
                email: username,
                password: password
            });
            const { token } = response.data.data;
            localStorage.setItem('authToken', token);
            localStorage.setItem('isLoggedIn', 'true');
            console.log(token);
            navigate('/home');
        } catch (error) {
            notification.error({
                message: '登录失败',
                description: error.response?.data?.message || '无法连接到服务器',
                placement: 'topRight',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="box" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <Card title="登录" style={{ width: 300 }}>
                <Form onFinish={handleLogin}>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '请输入你的用户名!' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="用户名"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入你的密码!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="密码"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
                <Button type="link" onClick={() => setRegisterModalVisible(true)}>
                    注册
                </Button>
            </Card>
            <RegisterModal
                visible={isRegisterModalVisible}
                onCancel={() => setRegisterModalVisible(false)}
            />
        </div>
    );
}

export default LoginPage;
