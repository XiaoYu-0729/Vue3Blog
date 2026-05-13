import { defineStore } from 'pinia'
import { request } from '../config/request'
import { getToken } from '../config/tools'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken() || null,
    userInfo: null,
  }),
  actions: {
    setUserState(data) {
        this.token = data.token
        this.userInfo = data.userInfo
    },
    clearUserState() {
        this.token = null
        this.userInfo = null
    },
    async fetchUserInfo() {
        try {
            const response = await request.get('/data/user', {
                _skipAuth: true
            });
            if (response.data.message === 'success' && response.data.userInfo) {
                this.userInfo = response.data.userInfo
            } else {
                throw new Error('获取用户信息失败')
            }
        } catch (e) {
            console.error(`获取用户信息失败: ${e.message}`)
            let errorMsg = '用户基本信息获取失败'
            if (e.response?.data?.message) {
                errorMsg = e.response.data.message
            } else if (e.response?.status) {
                errorMsg = e.response.statusText
            } else {
                errorMsg = e.message
            }
            alert(`获取用户信息失败: ${errorMsg}`)
        }
    }
  },
  getters: {
    isLoggedIn: (state) => !!state.token && !!state.userInfo
  }
})