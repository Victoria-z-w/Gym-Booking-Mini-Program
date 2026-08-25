import { get, post, put, del } from '../utils/request';

export const getUserInfo = () => get('/user/info');
export const updateCity = (city) => put('/user/city', { city });
export const getFavorites = () => get('/user/favorites');
export const toggleFavorite = (courseId) => post('/user/favorites/toggle', { courseId });
export const getCoupons = (status) => get('/user/coupons', { status });
export const getPoints = () => get('/user/points');
export const getSearchHistory = () => get('/user/search/history');
export const addSearchHistory = (keyword) => post('/user/search/history', { keyword });
export const clearSearchHistory = () => del('/user/search/history');
export const searchAll = (keyword) => get('/user/search', { keyword });
