import { get } from '../utils/request';

export const getOrderList = () => get('/orders/list');
export const getOrderDetail = (id) => get(`/orders/${id}`);
