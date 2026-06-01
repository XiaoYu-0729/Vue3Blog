<template>
  <div class="modal-overlay" v-if="visible" @click.self="handleClose">
    <div class="modal-container">
      <!-- 头部 -->
      <div class="modal-header">
        <h3 class="modal-title">
          <i class="fas fa-user-edit"></i>
          编辑个人资料
        </h3>
        <button class="close-btn" @click="handleClose">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- 表单内容 -->
      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <!-- 头像修改 -->
          <div class="form-group avatar-group">
            <label class="form-label">头像</label>
            <div class="avatar-upload">
              <img
                :src="avatarPreview || (formData.avatar ? `/flask${formData.avatar}` : '/image/默认头像.jpg')"
                @error="this.src='/image/默认头像.jpg'"
                alt="头像预览"
                class="avatar-preview"
              >
              <div class="avatar-actions">
                <input 
                  type="file" 
                  ref="fileInput" 
                  accept="image/*" 
                  @change="handleAvatarChange"
                  class="file-input"
                  hidden
                >
                <button type="button" class="btn-upload" @click="triggerFileInput">
                  <i class="fas fa-camera"></i>
                  更换头像
                </button>
              </div>
            </div>
          </div>

          <!-- 昵称 -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-user"></i>
              昵称
            </label>
            <input 
              v-model="formData.nickname" 
              type="text" 
              placeholder="请输入昵称"
              class="form-input"
            >
          </div>

          <!-- 个人简介 -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-info-circle"></i>
              个人简介
            </label>
            <textarea 
              v-model="formData.bio" 
              placeholder="介绍一下自己..."
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>

          <!-- 邮箱 -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-envelope"></i>
              邮箱
            </label>
            <input 
              v-model="formData.email" 
              type="email" 
              placeholder="请输入邮箱"
              class="form-input"
            >
          </div>

          <!-- 电话 -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-phone"></i>
              电话
            </label>
            <input 
              v-model="formData.phone" 
              type="tel" 
              placeholder="请输入电话号码"
              class="form-input"
            >
          </div>

          <!-- 密码修改 -->
          <div class="form-section">
            <div class="section-title" @click="showPasswordSection = !showPasswordSection">
              <i class="fas fa-lock"></i>
              修改密码
              <i class="fas fa-chevron-down" :class="{ 'rotate': showPasswordSection }"></i>
            </div>
            <div v-show="showPasswordSection" class="section-content">
              <div class="form-group">
                <label class="form-label">当前密码</label>
                <input 
                  v-model="formData.currentPassword" 
                  type="password" 
                  placeholder="请输入当前密码"
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label class="form-label">新密码</label>
                <input 
                  v-model="formData.newPassword" 
                  type="password" 
                  placeholder="请输入新密码"
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label class="form-label">确认新密码</label>
                <input 
                  v-model="formData.confirmPassword" 
                  type="password" 
                  placeholder="请再次输入新密码"
                  class="form-input"
                >
              </div>
            </div>
          </div>

          <!-- 底部按钮 -->
          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="handleClose">取消</button>
            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              <i class="fas fa-save"></i>
              {{ isSubmitting ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { uploadImage } from '@/config/request';
import { useUserStore } from '@/store/userStore';
import axios from 'axios';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const userStore = useUserStore();

const emit = defineEmits(['update:visible', 'submit', 'close']);

const router = useRouter();

const fileInput = ref(null);
const isSubmitting = ref(false);
const showPasswordSection = ref(false);

const formData = reactive({
  nickname: '',
  avatar: '',
  bio: '',
  email: '',
  phone: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 存储头像文件对象
const avatarFile = ref(null);
// 头像预览URL
const avatarPreview = ref('');

// 监听 userData 变化，填充表单
watch(() => userStore.userInfo, (newVal) => {
  if (newVal) {
    formData.nickname = newVal.nickname || '';
    formData.bio = newVal.bio || '';
    formData.email = newVal.email || '';
    formData.phone = newVal.phone || '';
    formData.avatar = newVal.avatar || '';
    avatarPreview.value = newVal.avatar ? `/flask${newVal.avatar}` : '';
    avatarFile.value = null;
  }
}, { immediate: true, deep: true });

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click();
};

// 处理头像选择
const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // 保存文件对象用于后续上传
    avatarFile.value = file;
    // 创建临时预览URL
    avatarPreview.value = URL.createObjectURL(file);
  }
};

// 关闭模态框
const handleClose = () => {
  emit('update:visible', false);
  emit('close');
  resetForm();
};

// 重置表单
const resetForm = () => {
  formData.currentPassword = '';
  formData.newPassword = '';
  formData.confirmPassword = '';
  showPasswordSection.value = false;
  avatarFile.value = null;
  avatarPreview.value = '';
};

// 提交表单
const handleSubmit = async () => {
  // 验证密码
  if (showPasswordSection.value) {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert('两次输入的新密码不一致');
      return;
    }
    if (formData.newPassword && !formData.currentPassword) {
      alert('请输入当前密码');
      return;
    }
  }
  // 验证昵称不能为空为空
  if (!formData.nickname) {
    alert('请输入昵称');
    return;
  }

  try {
    let avatarUrl = formData.avatar || '';

    // 如果有新头像文件，先上传到服务器（优化：添加到“提交修改数据”的API调用中）
    if (avatarFile.value) {
      try {
        const uploadResult = await uploadImage(avatarFile.value, 'avatar');
        avatarUrl = uploadResult;
      } catch (error) {
        let errorMessage = '上传失败，请重试';
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.status) {
          errorMessage = error.response.statusText;
        } else {
          errorMessage = error.message || '上传失败，请重试';
        }
        alert(`头像上传失败：${errorMessage}`);
        return;
      }
    }
    // 修改的数据
    const submitData = {
      username: userStore.userInfo.username,
      nickname: formData.nickname,
      avatar: avatarUrl,
      bio: formData.bio,
      email: formData.email || null,
      phone: formData.phone || null
    };

    // 添加密码字段
    if (showPasswordSection.value) {
      submitData.newPassword = formData.newPassword;
      submitData.currentPassword = formData.currentPassword;
    }

    isSubmitting.value = true;

    // 提交修改数据
    try {
      const response = await axios.put('/flask/update/user', submitData, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      if (response?.data?.message === 'success') {
        // 如果更新了密码
        if (showPasswordSection.value) {
          alert('密码修改成功，请重新登录');
          userStore.clearUserState();
          router.push('/login');
          return;
        } else {
          // 如果没有更新密码
          alert('更新成功');
        }
        await userStore.fetchUserInfo();
        handleClose();
      } else {
         throw new Error('更新失败，请重试');
      }
    } catch (error) {
      // 失败处理
      let errorMessage = '更新失败，请重试';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status) {
        errorMessage = error.response.statusText;
      } else {
        errorMessage = error.message;
      }
      alert(`更新失败：${errorMessage}`);
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
@import '/public/css/editmodal.css';
</style>
