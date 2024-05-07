import {booksData} from "./data";
import {useEffect, useState} from "react";
import api from "./axios";
// export function getBookById(bookId) {
//     for (let i = 0; i < booksData.length; i++) {
//         if (booksData[i].id === bookId) {
//             return booksData[i];
//         }
//     }
//     return undefined; // 如果没有找到，返回undefined
// }

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


const useBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 这里我们使用axios直接进行调用，假设你已经配置好了axios实例
                const url = `${process.env.REACT_APP_API_URL}/api/books`;
                const { data } = await api.get(url);
                setBooks(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching books:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { books, loading, error };
}

export default useBooks;