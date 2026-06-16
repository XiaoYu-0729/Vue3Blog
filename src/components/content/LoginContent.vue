<template>
  <div class="login-page">
    <div class="login-container">
      <!-- 登录装饰元素 -->
      <div class="login-decoration" v-if="!isMobile">
        <div class="deco-circle deco-circle-1"></div>
        <div class="deco-circle deco-circle-2"></div>
        <div class="deco-circle deco-circle-3"></div>
        <div class="deco-circle deco-circle-4"></div>
        <div class="deco-wave"></div>
        <div class="deco-divider"></div>
      </div>
      <!-- 登录框 -->
      <div class="login-box">
        <div class="login-header">
          <i class="fas fa-cloud"></i>
          <h2>雨落筱然</h2>
          <p>欢迎回来</p>
        </div>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label><i class="fas fa-user"></i> 用户名</label>
            <input v-model="username" type="text" placeholder="请输入用户名" />
          </div>
          <div class="form-group">
            <label><i class="fas fa-lock"></i> 密码</label>
            <input v-model="password" type="password" placeholder="请输入密码" />
          </div>
          <button type="submit" class="login-btn">
            <i class="fas fa-sign-in-alt"></i> 登录
          </button>
        </form>
        <div class="login-footer">
          <span>还没有账号？</span>
          <a href="#" @click.prevent="goRegister">立即注册</a>
        </div>
        <div class="skip-login">
          <a href="#" @click.prevent="handleSkip">跳过登录，直接浏览</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {  isMobile, checkMobile } from '@/config/tools';
import router from '@/config';
import { useUserStore } from '@/store/userStore';
import { request } from '@/config/request';

const username = ref('')
const password = ref('')
const userStore = useUserStore()

// 页面组件加载时检查是否为移动端
onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

const handleLogin = async () => {
  if (!username.value || !password.value) {
    alert('请输入用户名和密码')
    return
  }
  
  try {
    const response = await request.post('/login', {
      headers: {
        'Content-Type': 'application/json'
      },
      username: username.value,
      password: password.value
    })
    
    if (response?.data?.message === 'success' && response?.data?.userInfo) {
      userStore.setUserState(response.data);
      router.push('/')
    } else {
      throw new Error('登录失败')
    }
  } catch (error) {
    console.error('登录失败:', error)

    let errorMassage = '登录失败';
    if (error.response) {
      if (error.response?.data?.message) {
        errorMassage = `HTTP ${error.response.status} ${error.response.data.message}`;
      } else {
        errorMassage = `HTTP ${error.response.status} ${error.response.statusText}`;
      }
    } else {
      errorMassage = error.message;
    }
    alert('登录失败：' + errorMassage)
  }
}

// 跳过登录，直接浏览
const handleSkip = () => {
  router.push('/').then(() => {
    console.log('跳转成功');
  }).catch(err => {
    console.error('跳转失败:', err);
  });
}

// 跳转注册页面 
const goRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(145deg, #f3e8ff 0%, #fce4f0 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  border-radius: 28px;
  border: 2px solid rgba(230, 180, 255, 0.6);
  box-shadow: 0 20px 40px -10px rgba(170, 90, 220, 0.3);
  padding: 10px;
  display: flex;
  justify-content: flex-end;
  overflow: hidden;
  position: relative;
}

.login-decoration {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.4;
  box-shadow: 0 4px 16px rgba(185, 131, 255, 0.726);
}

.deco-circle-1 {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle at 30% 30%, #f3e8ff, #ca9eff);
  top: 12%;
  left: 8%;
  animation: float 7s ease-in-out infinite;
}

.deco-circle-2 {
  width: 110px;
  height: 110px;
  background: radial-gradient(circle at 70% 70%, #ca9eff, #fce4f0);
  bottom: 22%;
  left: 12%;
  animation: float 9s ease-in-out infinite reverse;
}

.deco-circle-3 {
  width: 70px;
  height: 70px;
  background: radial-gradient(circle at 50% 50%, #fce4f0, #b983ff);
  top: 52%;
  left: 30%;
  animation: float 6s ease-in-out infinite;
}

.deco-circle-4 {
  width: 50px;
  height: 50px;
  background: radial-gradient(circle at 30% 30%, #ffd0fb, #e0c0f0);
  bottom: 45%;
  right: 15%;
  animation: float 8s ease-in-out infinite;
  opacity: 0.5;
}

.deco-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 300 90' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23b983ff' fill-opacity='0.22' d='M0,45 C75,22 150,67 225,34 C262.5,18 285,30 300,23 L300,90 L0,90 Z'/%3E%3C/svg%3E");
  background-size: cover;
  border-right: 5px solid rgba(205, 167, 255, 0.1);
}

.deco-divider {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 90%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(185, 131, 255, 0.4) 20%,
    rgba(185, 131, 255, 0.6) 50%,
    rgba(185, 131, 255, 0.4) 80%,
    transparent 100%
  );
  border-radius: 2px;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(2deg);
  }
}

.login-box {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 20px 30px;
  margin: 20px;
  border: 1px solid rgba(255, 200, 240, 0.7);
  box-shadow: 0 12px 24px -6px rgba(170, 90, 220, 0.2);
  width: 54%;
  min-width: 320px;
  position: relative;
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header i {
  font-size: 48px;
  background: linear-gradient(135deg, #b983ff, #ff9cef);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-header h2 {
  font-size: 1.6rem;
  font-weight: 600;
  color: #9b4bcf;
  margin: 12px 0 8px;
  letter-spacing: 2px;
}

.login-header p {
  color: #b57cff;
  font-size: 0.95rem;
}

.login-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-weight: 500;
  color: #7c5a9e;
  font-size: 0.95rem;
}

.form-group label i {
  color: #b983ff;
  width: 18px;
}

.form-group input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e9d4f5;
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
  color: #3f2b4f;
  transition: border-color 0.3s, box-shadow 0.3s;
  box-sizing: border-box;
}

.form-group input::placeholder {
  color: #c4a8d4;
}

.form-group input:focus {
  outline: none;
  border-color: #b983ff;
  box-shadow: 0 0 0 4px rgba(185, 131, 255, 0.15);
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #b983ff 0%, #ff9cef 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 20px rgba(185, 131, 255, 0.4);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(185, 131, 255, 0.5);
}

.login-btn:active {
  transform: translateY(0);
}

.login-footer {
  text-align: center;
  color: #9b7bb8;
  font-size: 0.9rem;
}

.login-footer a {
  color: #b983ff;
  text-decoration: none;
  font-weight: 600;
  margin-left: 6px;
  transition: color 0.2s;
}

.login-footer a:hover {
  color: #ff9cef;
}

.skip-login {
  text-align: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(230, 200, 250, 0.5);
}

.skip-login a {
  color: #b57cff;
  text-decoration: none;
  font-size: 1rem;
  opacity: 0.8;
  transition: opacity 0.2s, color 0.2s;
}

.skip-login a:hover {
  opacity: 1;
  color: #9b4bcf;
}

@media (max-width: 800px) {
  .login-container {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: auto;
    width: auto;
    border-radius: 20px;
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: 5px;
  }

  .login-box {
    margin: 5px;
    padding: 30px 20px;
    border-radius: 20px;
  }

  .login-header {
    margin-bottom: 20px;
  }

  .login-header p {
    font-size: 0.8rem;
  }
  
  .login-header i {
    font-size: 35px;
  }
  
  .login-header h2 {
    font-size: 1.2rem;
  }

  .login-form {
    margin-bottom: 10px;
  }

  .form-group {
    margin-bottom: 12px;
  }

  .form-group label {
    margin-bottom: 5px;
    font-size: 0.8rem;
  }

  .form-group label i {
    width: 10px;
  }

  .form-group input {
    padding: 7px 6px;
    border-radius: 10px;
    font-size: 0.8rem;
  }

  .login-btn {
    width: 50%;
    padding: 8px;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 500;
    margin: 10px auto;
  }

  .login-footer {
    font-size: 0.85rem;
  }

  .skip-login {
    margin-top: 10px;
    padding-top: 10px;
  }

  .skip-login a {
    font-size: 0.9rem;
  }
}
</style>