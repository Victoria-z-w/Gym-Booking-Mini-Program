import { defineStore } from 'pinia';
import { getUserInfo, updateCity } from '../services/user';
import { getBookingCounts } from '../services/booking';
import { CITIES } from '../utils/constants';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    city: '上海市',
    bookedCount: 0,
    cities: CITIES,
  }),
  actions: {
    async fetchUserInfo() {
      try {
        const data = await getUserInfo();
        this.userInfo = data;
        this.city = data.city || '上海市';
        this.bookedCount = data.bookedCount || 0;
      } catch (e) {
        console.error(e);
      }
    },
    async setCity(city) {
      this.city = city;
      try {
        await updateCity(city);
      } catch (e) {
        console.error(e);
      }
    },
    async refreshBookingCount() {
      try {
        const data = await getBookingCounts();
        this.bookedCount = data.booked || 0;
      } catch (e) {
        console.error(e);
      }
    },
  },
});
