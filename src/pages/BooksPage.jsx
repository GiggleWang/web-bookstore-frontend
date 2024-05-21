import React from "react";
import {useParams} from "react-router-dom";
import BookIntro from "../components/BookIntro";

export default function BooksPage() {
    let { id } = useParams(); // 从路由参数中获取id，它是字符串类型
    const numericId = parseInt(id, 10); // 将字符串id转换为数字类型
    return (
        <BookIntro bookId={numericId} /> // 传递转换后的数字id
    );
};