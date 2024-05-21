import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../service/axios';

// 获取所有书籍的API调用
const fetchBooks = async () => {
    try {
        const response = await api.get(`${process.env.REACT_APP_API_URL}/api/books`);
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};

// 更新书籍的API调用
const updateBook = async (bookId, updatedBook) => {
    try {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/books/${bookId}`, updatedBook);
    } catch (error) {
        console.error('Error updating book:', error);
        throw error;
    }
};

// 删除书籍的API调用
const deleteBook = async (bookId) => {
    try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/books/${bookId}`);
    } catch (error) {
        console.error('Error deleting book:', error);
        throw error;
    }
};

// 添加新书籍的API调用
const addBook = async (newBook) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/books`, newBook);
        return response.data;
    } catch (error) {
        console.error('Error adding book:', error);
        throw error;
    }
};

const AdminBooks = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingBook, setEditingBook] = useState(null);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        cover: '',
        isbn: '',
        stock: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchBooks();
                setBooks(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleEdit = (book) => {
        setEditingBook(book);
    };

    const handleDelete = async (bookId) => {
        try {
            await deleteBook(bookId);
            setBooks(books.filter(book => book.id !== bookId));
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        try {
            await updateBook(editingBook.id, editingBook);
            setBooks(books.map(book => (book.id === editingBook.id ? editingBook : book)));
            setEditingBook(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAdd = async () => {
        try {
            const addedBook = await addBook(newBook);
            setBooks([...books, addedBook]);
            setNewBook({ title: '', author: '', cover: '', isbn: '', stock: 0 });
        } catch (error) {
            console.error(error);
        }
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1>管理图书</h1>
            <input
                type="text"
                placeholder="搜索书名"
                value={searchTerm}
                onChange={handleSearch}
            />
            <div>
                <h2>添加新书籍</h2>
                <input
                    type="text"
                    placeholder="书名"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="作者"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="封面URL"
                    value={newBook.cover}
                    onChange={(e) => setNewBook({ ...newBook, cover: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="ISBN编号"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="库存量"
                    value={newBook.stock}
                    onChange={(e) => setNewBook({ ...newBook, stock: parseInt(e.target.value) })}
                />
                <button onClick={handleAdd}>添加</button>
            </div>
            <ul>
                {filteredBooks.map(book => (
                    <li key={book.id}>
                        {editingBook && editingBook.id === book.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editingBook.title}
                                    onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                                />
                                <input
                                    type="text"
                                    value={editingBook.author}
                                    onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                                />
                                <input
                                    type="text"
                                    value={editingBook.cover}
                                    onChange={(e) => setEditingBook({ ...editingBook, cover: e.target.value })}
                                />
                                <input
                                    type="text"
                                    value={editingBook.isbn}
                                    onChange={(e) => setEditingBook({ ...editingBook, isbn: e.target.value })}
                                />
                                <input
                                    type="number"
                                    value={editingBook.stock}
                                    onChange={(e) => setEditingBook({ ...editingBook, stock: parseInt(e.target.value) })}
                                />
                                <button onClick={handleSave}>保存</button>
                                <button onClick={() => setEditingBook(null)}>取消</button>
                            </div>
                        ) : (
                            <div>
                                <span>{book.title}</span>
                                <span>{book.author}</span>
                                <span><img src={book.cover} alt={book.title} width="50" /></span>
                                <span>{book.isbn}</span>
                                <span>{book.stock}</span>
                                <button onClick={() => handleEdit(book)}>编辑</button>
                                <button onClick={() => handleDelete(book.id)}>删除</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminBooks;
