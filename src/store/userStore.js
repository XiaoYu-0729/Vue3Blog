import { defineStore } from 'pinia';
import axios from 'axios';

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
        try {
            const response = await axios.get('/flask/data/user');
            if (response.data.message === 'success' && response.data.userInfo) {
                this.setUserState(response.data);
            } else {
                throw new Error('获取用户信息失败')
            }
        } catch (e) {
            console.error(`获取用户信息失败: ${e.message}`)
            let errorMsg = '用户基本信息获取失败'
            if (e.response?.data?.message) {
                errorMsg = e.response.data.message;
            } else if (e.response?.status === 401 && e.response.data.msg) {
                errorMsg = `Token 无效/过期/不存在。${e.response.data.msg}`;
            } else if (e.response?.status) {
                errorMsg = `HTTP${e.response.status}: ${e.response.statusText}`;
            } else {
                errorMsg = e.message;
            }
            this.clearUserState();
            console.error(`获取用户信息失败，请重新登录。 ${errorMsg}`);
        }
    }
  }
})