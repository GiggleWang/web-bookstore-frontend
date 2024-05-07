// src/api/axios.js
import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

// 请求拦截器
api.interceptors.request.use(
    config => {
        // 从 localStorage 获取 token
        const token = localStorage.getItem('authToken');

        if (token) {
            console.log(token);
            // 如果 token 存在，则添加到请求头的 Authorization 字段
            config.headers['token'] = token;
        }
        return config;
    },
    error => {
        // 请求错误处理
        return Promise.reject(error);
    }
);

export default api;
