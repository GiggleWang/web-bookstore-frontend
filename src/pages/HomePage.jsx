import React from 'react';
import {Input} from 'antd';
import BooksExhibition from "../components/BooksExhibition";

const {Search} = Input;
const onSearch = (value, _e, info) => {
    console.log(info?.source, value);
};
const HomePage = () => (
    <div /*style={{maxHeight: '100%'}}*/>
        <Search
            placeholder="输入图书名称"
            allowClear
            enterButton="Search"
            size="large" onSearch={onSearch}
            style={{ marginBottom: '20px' }}
        />
        <BooksExhibition/>
    </div>
);

export default HomePage;