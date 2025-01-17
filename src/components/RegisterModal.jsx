import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, Button, notification, Select} from 'antd';
import axios from 'axios';

const {Option} = Select;

function RegisterModal({visible, onCancel}) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [nameExists, setNameExists] = useState(false);
    // 检查邮箱是否存在的异步函数
    const checkEmailExists = async (email) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/check-email?email=${encodeURIComponent(email)}`);
            setEmailExists(response.data.exists);
            form.validateFields(['email']); // 手动触发验证
        } catch (error) {
            console.error('Error checking email:', error);
            setEmailExists(false); // 如果无法连接到服务器，假设邮箱不存在
        }
    };

    const checkNameExists = async (name) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/check-name?name=${encodeURIComponent(name)}`);
            setNameExists(response.data.exists);
            form.validateFields(['name']); // 手动触发验证
        } catch (error) {
            console.error('Error checking email:', error);
            setNameExists(false); // 如果无法连接到服务器，假设邮箱不存在
        }
    }

    const handleValuesChange = (changedValues, allValues) => {
        // 当邮箱字段的值改变时，检查邮箱是否存在
        if (changedValues.hasOwnProperty('email')) {
            checkEmailExists(allValues.email);
        }
        if (changedValues.hasOwnProperty('name')) {
            checkNameExists(allValues.name);
        }
    };
    // 监听邮箱字段的变化
    useEffect(() => {
        const email = form.getFieldValue('email');
        if (email) {
            checkEmailExists(email);
        }
    }, [form.getFieldValue('email')]);
    useEffect(() => {
        const name = form.getFieldValue('name');
        if (name) {
            checkNameExists(name);
        }
    }, [form.getFieldValue('name')]);

    const handleRegister = async (values) => {
        setLoading(true);
        try {
            const url = `${process.env.REACT_APP_API_URL}/api/register`;
            const {email, password, name, address, telephone, type} = values;
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
                onValuesChange={handleValuesChange}
            >
                <Form.Item
                    name="email"
                    label="电子邮件"
                    rules={[
                        {required: true, message: '请输入你的电子邮件!'},
                        {type: 'email', message: '请输入有效的电子邮件!'},
                        () => ({
                            validator(_, value) {
                                if (!value) {
                                    return Promise.resolve();
                                }
                                if (emailExists) {
                                    return Promise.reject(new Error('该电子邮件已被注册!'));
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="password"
                    label="密码"
                    rules={[{required: true, message: '请输入你的密码!'}]}
                    hasFeedback
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    label="确认密码"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {required: true, message: '请确认你的密码!'},
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('两次输入的密码不一致!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item
                    name="name"
                    label="名字"
                    rules={[{required: true, message: '请输入你的名字!'},
                        () => ({
                        validator(_, value) {
                        if (!value) {
                        return Promise.resolve();
                    }
                        if (nameExists) {
                        return Promise.reject(new Error('该名称已存在'));
                    }
                        return Promise.resolve();
                    },
                    }),]
                }

                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="address"
                    label="地址"
                    rules={[{required: true, message: '请输入你的地址!'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="telephone"
                    label="电话"
                    rules={[{required: true, message: '请输入你的电话号码!'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="type"
                    label="用户类型"
                    rules={[{required: true, message: '请选择用户类型!'}]}
                >
                    <Select>
                        <Option value="0">用户</Option>
                        <Option value="1">管理员</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{width: '100%'}} loading={loading}>
                        注册
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default RegisterModal;
