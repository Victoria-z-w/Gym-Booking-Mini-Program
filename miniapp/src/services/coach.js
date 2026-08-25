import { get } from '../utils/request';

export const getCoachList = (params) => get('/coaches/list', params);
export const getCoachDetail = (id) => get(`/coaches/${id}`);
