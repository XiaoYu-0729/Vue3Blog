<template>
  <div class="register-page">
    <div class="register-container">
      <div class="back-btn-wrapper">
        <button class="back-btn" @click.prevent="goLogin"><i class="fas fa-arrow-left"></i> 返回登录</button>
      </div>

      <div class="register-box">
        <div class="register-header">
          <i class="fas fa-user-plus"></i>
          <h2>创建账号</h2>
          <p>加入雨落筱然</p>
        </div>
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label><i class="fas fa-user"></i> 用户名 <span class="required">*</span></label>
            <input v-model="username" type="text" placeholder="请输入用户名" />
            <small class="form-text text-muted">请注意：请记住用户名，在没有手机号和邮箱的情况下，其为唯一登录账号标识。</small>
          </div>
          <div class="form-group">
            <label><i class="fas fa-lock"></i> 密码 <span class="required">*</span></label>
            <input v-model="password" type="password" placeholder="请输入密码" />
          </div>
          <div class="form-group">
            <label><i class="fas fa-lock"></i> 确认密码 <span class="required">*</span></label>
            <input v-model="confirmPassword" type="password" placeholder="请再次输入密码" />
          </div>
          <div class="form-group optional-group">
            <label><i class="fas fa-envelope"></i> 邮箱 <span class="optional">(选填)</span></label>
            <input v-model="email" type="email" placeholder="请输入邮箱" />
          </div>
          <div class="form-group optional-group">
            <label><i class="fas fa-phone"></i> 电话 <span class="optional">(选填)</span></label>
            <input v-model="phone" type="tel" placeholder="请输入电话" />
          </div>
          <button type="submit" class="register-btn">
            <i class="fas fa-user-plus"></i> 注册
          </button>
        </form>
        <div class="skip-register">
          <a href="#" @click.prevent="handleSkip">跳过注册，直接浏览</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { request } from '@/config/request';
import router from '@/config'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const email = ref('')
const phone = ref('')

const handleRegister = async () => {
  if (!username.value || !password.value || !confirmPassword.value) {
    alert('请填写必填项')
    return
  }

  if (password.value !== confirmPassword.value) {
    alert('两次输入的密码不一致')
    return
  }

  try {
    // 发送注册请求
    const response = await request.post('/login/register', {
      username: username.value,
      password: password.value,
      email: email.value || null,
      phone: phone.value || null
    })

    // 处理注册成功
    if (response.data && response.data.message === 'success') {
      alert('注册成功！请登录')
      router.push('/login')
    } else {
      throw new Error('注册失败')
    }
  } catch (error) {
    console.error('注册失败:', error)

    // 显示错误信息(error.response?.data的问号用于检查网络错误)
    let errorMessage = '注册失败'
    if (error.response?.data && error.response.status === 500 && error.response.data.message) {
      errorMessage = error.response.data.message
    } else {
      errorMessage = error.message
    }
    alert(`注册失败：${errorMessage}`)
  }
}

const goLogin = () => {
  router.push('/login')
}

const handleSkip = () => {
  router.push('/')
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(145deg, #f3e8ff 0%, #fce4f0 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  border-radius: 28px;
  border: 2px solid rgba(230, 180, 255, 0.6);
  box-shadow: 0 20px 40px -10px rgba(170, 90, 220, 0.3);
  padding: 50px 10px 10px;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.register-box {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 20px 30px;
  margin: 20px;
  border: 1px solid rgba(255, 200, 240, 0.7);
  box-shadow: 0 12px 24px -6px rgba(170, 90, 220, 0.2);
  width: 100%;
  min-width: auto;
  position: relative;
  z-index: 1;
}

.register-header {
  text-align: center;
  margin-bottom: 24px;
}

.register-header i {
  font-size: 42px;
  background: linear-gradient(135deg, #b983ff, #ff9cef);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.register-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #9b4bcf;
  margin: 10px 0 6px;
  letter-spacing: 2px;
}

.register-header p {
  color: #b57cff;
  font-size: 0.9rem;
}

.register-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  font-weight: 500;
  color: #7c5a9e;
  font-size: 0.9rem;
}

.form-group label i {
  color: #b983ff;
  width: 16px;
}

.required {
  color: #ff6b9d;
  font-weight: 600;
}

.optional {
  color: #c4a8d4;
  font-weight: 400;
  font-size: 0.8rem;
}

.form-group input {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e9d4f5;
  border-radius: 12px;
  font-size: 0.95rem;
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

.form-text {
  display: block;
  margin-top: 6px;
  padding: 6px 12px;
  font-size: 0.78rem;
  color: #b57cff;
  background: rgba(245, 235, 255, 0.5);
  border-radius: 8px;
  border-left: 3px solid #ca9eff;
  line-height: 1.5;
}

.optional-group label {
  color: #b09bc4;
}

.optional-group input {
  background: rgba(255, 255, 255, 0.6);
  border-style: dashed;
}

.register-btn {
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
  margin-top: 8px;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(185, 131, 255, 0.5);
}

.register-btn:active {
  transform: translateY(0);
}

.back-btn-wrapper {
  position: absolute;
  top: 17px;
  right: 30px;
  z-index: 10;
}

.back-btn {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(230, 180, 255, 0.6);
  border-radius: 20px;
  padding: 8px 18px;
  color: #b983ff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}

.back-btn:hover {
  background: rgba(185, 131, 255, 0.15);
  color: #9b4bcf;
  box-shadow: 0 2px 8px rgba(185, 131, 255, 0.25);
}

.skip-register {
  text-align: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(230, 200, 250, 0.5);
}

.skip-register a {
  color: #b57cff;
  text-decoration: none;
  font-size: 1rem;
  opacity: 0.8;
  transition: opacity 0.2s, color 0.2s;
}

.skip-register a:hover {
  opacity: 1;
  color: #9b4bcf;
}

@media (max-width: 480px) {
  .register-header {
    margin-bottom: 15px;
  }

  .register-header i {
    font-size: 35px;
  }

  .register-header h2 {
    font-size: 1.2rem;
  }

  .register-page {
    padding: 10px;
  }

  .register-container {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: auto;
    width: auto;
    border-radius: 20px;
  }

  .register-box {
    padding: 20px;
    margin: 5px;
    border-radius: 20px;
  }
  
  .register-header i {
    font-size: 34px;
  }
  
  .register-header h2 {
    font-size: 1.3rem;
  }

  .form-group {
    margin-bottom: 12px;
  }

  .form-group input {
    padding: 7px 6px;
    font-size: 0.8rem;
    border-radius: 10px;
  }

  .form-group label {
    margin-bottom: 5px;
    font-size: 0.8rem;
  }

  .form-group label i {
    width: 10px;
  }

  .form-text {
    margin-top: 3px;
    padding: 5px 8px;
    font-size: 0.7rem;
    border-radius: 8px;
    line-height: 1.3;
  }

  .back-btn-wrapper {
    top: 12px;
    right: 13px;
  }

  .back-btn {
    border-radius: 15px;
    padding: 5px 10px;
    font-size: 0.8rem;
  }

  .register-btn {
    width: 50%;
    padding: 8px;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 500;
    margin: 10px auto;
  }

  .skip-register {
    margin-top: 10px;
    padding-top: 10px;
  }

  .skip-register a {
    font-size: 0.9rem;
  }
}
</style>