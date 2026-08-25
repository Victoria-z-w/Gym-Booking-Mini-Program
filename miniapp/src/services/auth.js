import { post } from '../utils/request';
import { TOKEN_KEY } from '../config';

export function wxLogin() {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: async (res) => {
        try {
          const data = await post('/auth/login', { code: res.code });
          if (data.token) {
            uni.setStorageSync(TOKEN_KEY, data.token);
          }
          resolve(data);
        } catch (e) {
          reject(e);
        }
      },
      fail: reject,
    });
  });
}
