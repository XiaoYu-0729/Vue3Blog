import { defineStore } from 'pinia';
import { request } from '@/config/request';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    userInfo: null,
  }),
  actions: {
    setUserState(data) {
        this.isLoggedIn = true
        this.userInfo = data.userInfo
    },
    clearUserState() {
        this.isLoggedIn = false
        this.userInfo = null
    },
    async fetchUserInfo() {
        const response = await request.get('/data/user');
        if (response.data.message === 'success' && response.data.userInfo) {
            this.setUserState(response.data);
        } else {
            throw new Error('获取用户信息失败');
        }
    }
  }
})