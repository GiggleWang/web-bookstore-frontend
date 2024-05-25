import React from 'react';
import { Input } from 'antd';
import BooksExhibition from "../components/BooksExhibition";
import AdminBooks from "../components/AdminBooks";
const HomePage = () => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    return (
        isAdmin ? (
            <div>
                <AdminBooks/>
            </div>
        ) : (
            <div>
                <BooksExhibition />
            </div>
        )
    );
};

export default HomePage;
