import { get } from '../utils/request';

export const getGymList = (params) => get('/gyms/list', params);
export const getGymDetail = (id) => get(`/gyms/${id}`);
