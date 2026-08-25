/**
 * 生产环境请在 .env.production 中设置：
 * VITE_API_BASE=https://你的域名.com/api
 */
const stored = uni.getStorageSync('API_BASE');
const envBase = import.meta.env.VITE_API_BASE;

export const API_BASE = stored || envBase || 'http://localhost:3000/api';

export const TOKEN_KEY = 'GYM_TOKEN';
