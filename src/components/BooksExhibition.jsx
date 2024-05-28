import React, { useState } from "react";
import { Input, Row, Col, Pagination } from "antd";
import BookCard from "./BookCard";
import useBooks from "../service/books";

export default function BooksExhibition() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;
    const { books: booksDatabase, total, loading, error } = useBooks(searchQuery, currentPage, pageSize);

    const handleSearchChange = (value) => {
        setSearchQuery(value);
        setCurrentPage(1); // Reset to first page
    };

    return (
        <div>
            <Input.Search
                placeholder="搜索书籍"
                onSearch={handleSearchChange}
                style={{ marginBottom: 16, width: 300 }}
                enterButton
            />

            <Row gutter={[16, 16]}>
                {booksDatabase.map((book) => (
                    <Col span={4} key={book.id}>
                        <BookCard book={book} />
                    </Col>
                ))}
            </Row>

            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total} // 使用从后端获取的总数
                onChange={page => setCurrentPage(page)}
            />
        </div>
    );
}
