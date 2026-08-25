import { defineStore } from 'pinia';
import { wxLogin } from '../services/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loggedIn: false,
    loginError: '',
  }),
  actions: {
    async login() {
      try {
        await wxLogin();
        this.loggedIn = true;
        this.loginError = '';
      } catch (e) {
        this.loginError = '登录失败，请检查网络或后端服务';
        console.error(e);
      }
    },
  },
});
