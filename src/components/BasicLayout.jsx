import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ShoppingCartPage from '../pages/ShoppingCartPage';
import OrdersPage from '../pages/OrdersPage';
import RankingsPage from '../pages/RankingsPage';
import Logo from "../components/Logo";
import UserBar from "./UserBar";
import BooksPage from "../pages/BooksPage";
import UserPage from "../pages/UserPage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import MemberPage from "../pages/MemberPage";

const { Header, Content, Footer } = Layout;

const BasicLayout = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    const getMenuItems = () => {
        if (isAdmin) {
            return [
                { key: '1', label: (<Link to="/home">书籍管理</Link>) },
                { key: '2', label: (<Link to="/member">人员管理</Link>) },
                // { key: '3', label: (<Link to="/home">书籍管理</Link>) },
            ];
        } else {
            return [
                { key: '1', label: (<Link to="/home">首页</Link>) },
                { key: '2', label: (<Link to="/cart">购物车</Link>) },
                { key: '3', label: (<Link to="/orders">订单</Link>) },
                { key: '4', label: (<Link to="/rankings">排行</Link>) },
                { key: '5', label: (<Link to="/user">用户</Link>) },
            ];
        }
    };

    return (
        <div>
            <Router>
                <Layout style={{ minHeight: '100vh' }}>
                    <Header style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'white',
                    }}>
                        <Logo />
                        <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']} items={getMenuItems()} style={{ flex: 1, minWidth: 0 }} />
                        <UserBar />
                    </Header>
                    <Content style={{ padding: '0 48px' }}>
                        <div style={{
                            marginTop: 25,
                            padding: 24,
                            minHeight: 380,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}>
                            <Routes>
                                <Route path="/" element={<LoginPage />} />
                                <Route path="/home" element={<ProtectedRoute component={HomePage} />} />
                                <Route path="/cart" element={<ProtectedRoute component={ShoppingCartPage} />} />
                                <Route path="/orders" element={<ProtectedRoute component={OrdersPage} />} />
                                <Route path="/rankings" element={<ProtectedRoute component={RankingsPage} />} />
                                <Route path="/user" element={<ProtectedRoute component={UserPage} />} />
                                <Route path="/book/:id" element={<ProtectedRoute component={BooksPage} />} />
                                <Route path="/member" element={<ProtectedRoute component={MemberPage} />} />
                            </Routes>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Yixiao Design ©{new Date().getFullYear()} Created by Yixiao</Footer>
                </Layout>
            </Router>
        </div>
    );
};

export default BasicLayout;
