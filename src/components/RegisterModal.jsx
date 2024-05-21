import React, { useState } from 'react';
import { Modal, Form, Input, Button, notification, Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

function RegisterModal({ visible, onCancel }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleRegister = async (values) => {
        setLoading(true);
        try {
            const url = `${process.env.REACT_APP_API_URL}/api/register`;
            const { email, password, name, address, telephone, type } = values;
            const response = await axios.post(url, {
                email,
                password,
                name,
                address,
                telephone,
                type: parseInt(type) // 将type转换为整数
            });

            notification.success({
                message: '注册成功',
                description: '你已经成功注册!',
                placement: 'topRight',
            });

            form.resetFields();
            onCancel(); // 关闭弹窗
        } catch (error) {
            notification.error({
                message: '注册失败',
                description: error.response?.data?.message || '无法连接到服务器',
                placement: 'topRight',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            title="注册"
            onCancel={onCancel}
            footer={null}
        >
            <Form
                form={form}
                onFinish={handleRegister}
                layout="vertical"
            >
                <Form.Item
                    name="email"
                    label="电子邮件"
                    rules={[
                        { required: true, message: '请输入你的电子邮件!' },
                        { type: 'email', message: '请输入有效的电子邮件!' }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="密码"
                    rules={[{ required: true, message: '请输入你的密码!' }]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    label="确认密码"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        { required: true, message: '请确认你的密码!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('两次输入的密码不一致!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="name"
                    label="名字"
                    rules={[{ required: true, message: '请输入你的名字!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="address"
                    label="地址"
                    rules={[{ required: true, message: '请输入你的地址!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="telephone"
                    label="电话"
                    rules={[{ required: true, message: '请输入你的电话号码!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="type"
                    label="用户类型"
                    rules={[{ required: true, message: '请选择用户类型!' }]}
                >
                    <Select>
                        <Option value="0">用户</Option>
                        <Option value="1">管理员</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
                        注册
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default RegisterModal;
