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
const useBooks = (searchQuery = '', page = 1, pageSize = 12) => {
    const [books, setBooks] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = {
                    name: searchQuery,
                    page: page - 1, // 后端分页从0开始
                    size: pageSize,
                };
                const url = `${process.env.REACT_APP_API_URL}/api/books`;
                const { data } = await api.get(url, { params });
                setBooks(data.books); // 假设返回的数据结构为 { books: [], currentPage: 1, totalItems: 100, totalPages: 10 }
                setTotal(data.totalItems);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching books:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [searchQuery, page, pageSize]);

    return { books, total, loading, error };
};

export default useBooks;