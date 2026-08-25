import { API_BASE, TOKEN_KEY } from '../config';

export function request(options) {
  const token = uni.getStorageSync(TOKEN_KEY);
  return new Promise((resolve, reject) => {
    uni.request({
      url: API_BASE + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.header,
      },
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            resolve(res.data.data);
          } else {
            uni.showToast({ title: res.data.message || '请求失败', icon: 'none' });
            reject(res.data);
          }
        } else if (res.statusCode === 401) {
          uni.removeStorageSync(TOKEN_KEY);
          reject(res.data);
        } else {
          reject(res);
        }
      },
      fail: () => {
        uni.showToast({ title: '网络连接失败', icon: 'none' });
        reject(new Error('network'));
      },
    });
  });
}

export function get(url, data) {
  return request({ url, method: 'GET', data });
}

export function post(url, data) {
  return request({ url, method: 'POST', data });
}

export function put(url, data) {
  return request({ url, method: 'PUT', data });
}

export function del(url, data) {
  return request({ url, method: 'DELETE', data });
}
