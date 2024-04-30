import {booksData} from "./data";
export function getBookById(bookId) {
    for (let i = 0; i < booksData.length; i++) {
        if (booksData[i].id === bookId) {
            return booksData[i];
        }
    }
    return undefined; // 如果没有找到，返回undefined
}