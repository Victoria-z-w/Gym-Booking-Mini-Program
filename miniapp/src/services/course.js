import { get } from '../utils/request';

export const getBanners = () => get('/courses/banners');
export const getHotCourses = () => get('/courses/hot');
export const getCourseList = (params) => get('/courses/list', params);
export const getCourseDetail = (id) => get(`/courses/${id}`);
export const getCourseSchedules = (courseId, date) =>
  get(`/courses/${courseId}/schedules`, { date });
