import {booksData} from "./data";
import {useEffect, useState} from "react";
import api from "./axios";
// 异步获取书籍数据
export async function getBookById(bookId) {
    try {
        // 向API发送请求，获取特定ID的书籍数据
        const url = `${process.env.REACT_APP_API_URL}/api/books/${bookId}`;
        const response = await api.get(url);
        console.log(response.data);
        return response.data; // 返回书籍数据

    } catch (error) {
        console.error('Error fetching the book:', error);
        return undefined; // 如果发生错误或找不到书籍，返回undefined
    }
}

const useBooks = (searchQuery = '') => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = searchQuery ? { params: { name: searchQuery } } : {};
                const url = `${process.env.REACT_APP_API_URL}/api/books`;
                const { data } = await api.get(url, params);
                setBooks(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching books:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [searchQuery]);

    return { books, loading, error };
};

export default useBooks;