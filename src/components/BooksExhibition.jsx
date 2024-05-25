import React, { useState } from "react";
import { Input, Row, Col, Pagination } from "antd";
import BookCard from "./BookCard";
import useBooks from "../service/books";

export default function BooksExhibition() {
    const [searchQuery, setSearchQuery] = useState('');
    const { books: booksDatabase, loading, error } = useBooks(searchQuery);
    const pageSize = 12;
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearchChange = (value) => {
        setSearchQuery(value);
        setCurrentPage(1); // 重置到第一页
    };


    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const displayedBooks = booksDatabase.slice(startIndex, endIndex);

    return (
        <div>
            <Input.Search
                placeholder="搜索书籍"
                onSearch={handleSearchChange}
                style={{ marginBottom: 16, width: 300 }}
                enterButton
            />

            <Row gutter={[16, 16]}>
                {displayedBooks.map((book, index) => (
                    <Col span={4} key={book.id}>
                        <BookCard book={book} />
                    </Col>
                ))}
            </Row>

            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={booksDatabase.length}
                onChange={page => setCurrentPage(page)}
            />
        </div>
    );
}
