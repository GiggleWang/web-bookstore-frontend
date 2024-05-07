import React, { useState} from "react";
import { Pagination ,Row,Col} from "antd";
import BookCard from "./BookCard";
import useBooks from "../service/books";
export default function BooksExhibition() {
    const { books: booksDatabase, loading, error } = useBooks();  // 正确提取 books 数组
    const pageSize = 12; // 6列*2行，每页展示12本书
    const [currentPage, setCurrentPage] = useState(1);

    console.log(booksDatabase);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const displayedBooks = booksDatabase.slice(startIndex, endIndex);

    return (
        <div>
            <Row gutter={[16, 16]}>
                {displayedBooks.map((book, index) => (
                    <Col span={4} key={book.id}>
                        <BookCard book={book} />
                    </Col>
                ))}
            </Row>

            {/* 分页器 */}
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={booksDatabase.length}
                onChange={page => setCurrentPage(page)}
            />
        </div>
    );
}
