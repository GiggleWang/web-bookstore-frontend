import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import "../css/login.css"

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const url = `${process.env.REACT_APP_API_URL}/api/login`;
            console.log(url);
            // 发送请求到后端登录接口
            const response = await axios.post(url, {
                email: username,  // 这里使用email作为键，但表单中使用的是用户名，确保这一点与后端期望的一致
                password: password
            });
            // 确保在这里正确地获取token
            const { token } = response.data.data; // 注意这里修改为 response.data.data 获取嵌套的token
            localStorage.setItem('authToken', token);
            localStorage.setItem('isLoggedIn','true');
            console.log(token);
            // 导航到主页
            navigate('/home');
        } catch (error) {
            // 显示错误信息
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
                <Form
                    onFinish={handleLogin}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '请输入你的用户名!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名"
                               value={username} onChange={e => setUsername(e.target.value)} />
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
            </Card>
        </div>
    );
}

export default LoginPage;
