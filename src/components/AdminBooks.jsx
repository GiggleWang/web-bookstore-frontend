import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber } from 'antd';
import axios from 'axios';
import api from '../service/axios';
const fetchBooks = async (searchQuery = '') => {
    try {
        const response = await api.get(`${process.env.REACT_APP_API_URL}/api/admin/books`, {
            params: { name: searchQuery }  // 假设后端接受名为 'name' 的查询参数来过滤书名
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};

const updateBook = async (bookId, updatedBook) => {
    try {
        await api.put(`${process.env.REACT_APP_API_URL}/api/admin/books/${bookId}`, updatedBook);
    } catch (error) {
        console.error('Error updating book:', error);
        throw error;
    }
};

const deleteBook = async (bookId) => {
    try {
        await api.delete(`${process.env.REACT_APP_API_URL}/api/admin/books/${bookId}`);
    } catch (error) {
        console.error('Error deleting book:', error);
        throw error;
    }
};

const addBook = async (newBook) => {
    try {
        const response = await api.post(`${process.env.REACT_APP_API_URL}/api/admin/books`, newBook);
        return response.data;
    } catch (error) {
        console.error('Error adding book:', error);
        throw error;
    }
};

const AdminBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingBook, setEditingBook] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchBooks(searchQuery);
                setBooks(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [searchQuery]);

    const showEditModal = (book) => {
        setEditingBook(book);
        form.setFieldsValue(book);
        setIsModalVisible(true);
    };

    const showAddModal = () => {
        form.resetFields();
        setIsAddModalVisible(true);
    };

    const handleEditOk = async () => {
        try {
            const updatedBook = await form.validateFields();
            await updateBook(editingBook.id, updatedBook);
            setBooks(books.map(book => (book.id === editingBook.id ? { ...book, ...updatedBook } : book)));
            setIsModalVisible(false);
            setEditingBook(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddOk = async () => {
        try {
            const newBook = await form.validateFields();
            const addedBook = await addBook(newBook);
            setBooks([...books, addedBook]);
            setIsAddModalVisible(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (bookId) => {
        try {
            await deleteBook(bookId);
            setBooks(books.filter(book => book.id !== bookId));
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsAddModalVisible(false);
        setEditingBook(null);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '书名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '作者',
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '封面',
            dataIndex: 'cover',
            key: 'cover',
            render: (text) => <img src={text} alt="cover" width="50" />,
        },
        {
            title: 'ISBN 编号',
            dataIndex: 'isbn',
            key: 'isbn',
        },
        {
            title: '库存量',
            dataIndex: 'leftNum',
            key: 'leftNum',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button onClick={() => showEditModal(record)}>修改</Button>
                    <Button onClick={() => handleDelete(record.id)} style={{ marginLeft: 8 }}>删除</Button>
                </span>
            ),
        },
    ];
    const handleSearch = (value) => {
        setSearchQuery(value);  // 设置搜索关键字并触发 useEffect
    };
    return (
        <div>
            <Input.Search
                placeholder="搜索书名"
                onSearch={handleSearch}
                style={{ marginBottom: 16, width: 300 }}
            />
            <Table columns={columns} dataSource={books} rowKey="id" loading={loading} />
            <Button type="primary" onClick={showAddModal} style={{ marginTop: 16 }}>添加新书籍</Button>
            <Modal
                title="修改书籍"
                visible={isModalVisible}
                onOk={handleEditOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="id" label="ID">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name="name" label="书名" rules={[{ required: true, message: '请输入书名' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="author" label="作者" rules={[{ required: true, message: '请输入作者' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="price" label="价格" rules={[{ required: true, message: '请输入价格' }]}>
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item name="description" label="描述" rules={[{ required: true, message: '请输入描述' }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="cover" label="封面URL" rules={[{ required: true, message: '请输入封面URL' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="isbn" label="ISBN 编号" rules={[{ required: true, message: '请输入ISBN编号' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="leftNum" label="库存量" rules={[{ required: true, message: '请输入库存量' }]}>
                        <InputNumber min={0} />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="添加新书籍"
                visible={isAddModalVisible}
                onOk={handleAddOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="书名" rules={[{ required: true, message: '请输入书名' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="author" label="作者" rules={[{ required: true, message: '请输入作者' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="price" label="价格" rules={[{ required: true, message: '请输入价格' }]}>
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item name="description" label="描述" rules={[{ required: true, message: '请输入描述' }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="cover" label="封面URL" rules={[{ required: true, message: '请输入封面URL' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="isbn" label="ISBN 编号" rules={[{ required: true, message: '请输入ISBN编号' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="leftNum" label="库存量" rules={[{ required: true, message: '请输入库存量' }]}>
                        <InputNumber min={0} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminBooks;
