import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

    // 登录并存储token
    const login = async (email, password) => {
        try {
            const url = `${process.env.REACT_APP_API_URL}/api/login`;
            const response = await axios.post(url, { email, password });
            const token = response.data.token;
            localStorage.setItem('authToken', token);
            setAuthToken(token);
            return response.data;
        } catch (error) {
            console.error('登录失败:', error);
        }
    };

    // 设置axios全局请求拦截器
    useEffect(() => {
        const interceptor = axios.interceptors.request.use(config => {
            if (authToken) {
                config.headers.Authorization = `Bearer ${authToken}`;
            }
            return config;
        }, error => Promise.reject(error));

        // 清除拦截器
        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, [authToken]); // 依赖authToken变化

    return (
        <AuthContext.Provider value={{ authToken, login }}>
            {children}
        </AuthContext.Provider>
    );
};

// 自定义Hook，用于在组件中访问AuthContext
export const useAuth = () => useContext(AuthContext);
