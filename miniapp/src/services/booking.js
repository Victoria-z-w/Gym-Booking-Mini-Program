import { get, post } from '../utils/request';

export const getBookingList = (status) => get('/bookings/list', { status });
export const getBookingCounts = () => get('/bookings/counts');
export const getBookingDetail = (id) => get(`/bookings/${id}`);
export const createBooking = (data) => post('/bookings/create', data);
export const cancelBooking = (id) => post(`/bookings/${id}/cancel`);
export const reviewBooking = (id, data) => post(`/bookings/${id}/review`, data);
