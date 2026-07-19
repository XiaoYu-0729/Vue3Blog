<template>
  <div class="profile-content">
    <!-- 编辑资料模态框 -->
    <ProfileEditModal 
      v-model:visible="showEditModal"
    />

    <!-- 装饰背景 -->
    <div class="decorative-bg">
      <div class="decor-circle circle-1"></div>
      <div class="decor-circle circle-2"></div>
    </div>

    <!-- 用户信息头部 -->
    <div class="profile-header">
      <div class="avatar-wrapper">
        <img class="avatar" :src="userStore.userInfo.avatar ? `/flask${userStore.userInfo.avatar}` : 'image/默认头像.jpg'" alt="用户头像" @error="this.src='/image/默认头像.jpg'">
        <!-- <div class="avatar-ring"></div> -->
      </div>
      <h2>{{ userStore.userInfo.nickname }}</h2>

      <!-- 个人简介 -->
       <p class="profile-bio">{{ userStore.userInfo.bio || '暂无个人简介' }}</p>
      
      <div class="profile-stats">
        <div class="stat-item">
          <span class="stat-num">{{ userStore.userInfo.articleCount }}</span>
          <span class="stat-label">文章</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num">{{ userStore.userInfo.projectCount }}</span>
          <span class="stat-label">项目</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num">{{ userStore.userInfo.visitorCount }}</span>
          <span class="stat-label">访客</span>
        </div>
      </div>
    </div>

    <!-- 动态渲染菜单区块 -->
    <template v-for="(section, index) in menuSections" :key="index">
      <div class="divider">
        <span class="divider-dot"></span>
        <span class="divider-line"></span>
        <span class="divider-dot"></span>
      </div>
      
      <div class="menu-section">
        <div class="menu-list">
          <div 
            v-for="item in section.items" 
            :key="item.id"
            class="menu-item" 
            @click="handleMenuClick(item.action)"
          >
            <div class="menu-icon" :style="{ background: item.gradient }">
              <i :class="item.icon"></i>
            </div>
            <div class="menu-text">
              <span class="menu-label">{{ item.label }}</span>
              <span class="menu-arrow">
                <i class="fas fa-chevron-right"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 退出登录按钮 -->
    <div class="logout-section">
      <button class="logout-btn" @click="handleLogout">
        <i class="fas fa-sign-out-alt"></i>
        退出登录
      </button>
    </div>

    <!-- 底部信息 -->
    <div class="profile-footer">
      <p class="copyright">© 2025 雨落筱然</p>
      <p class="version">Version {{ version }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/userStore.js';
import ProfileEditModal from '../tools/ProfileEditModal.vue';
import { request } from '@/config/request.js';

const router = useRouter();

const userStore = useUserStore();

// 控制编辑模态框显示
const showEditModal = ref(false);

// 版本号
const version = ref('1.0.0');

// 菜单数据结构 - 使用Vue3响应式数据
const menuSections = reactive([
  {
    items: [
      { id: 1, icon: 'fas fa-pen', label: '创建文章', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', action: 'article' },
      { id: 2, icon: 'fas fa-folder-plus', label: '创建项目', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', action: 'project' }
    ]
  },
  {
    items: [
      { id: 3, icon: 'fas fa-book-open', label: '我的文章', gradient: 'linear-gradient(135deg, #fa709a, #fee140)', action: 'articles' },
      { id: 4, icon: 'fas fa-cubes', label: '我的项目', gradient: 'linear-gradient(135deg, #30cfd0, #330867)', action: 'projects' },
      { id: 5, icon: 'fas fa-heart', label: '我的点赞', gradient: 'linear-gradient(135deg, #ff9a9e, #fecfef)', action: 'likes' },
      { id: 6, icon: 'fas fa-star', label: '我的收藏', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', action: 'collections' },
      // { id: 7, icon: 'fas fa-history', label: '浏览历史', gradient: 'linear-gradient(135deg, #84fab0, #8fd3f4)', action: 'history' },
    ]
  },
  {
    items: [
      { id: 8, icon: 'fas fa-user', label: '编辑个人资料', gradient: 'linear-gradient(135deg, #84fab0, #8fd3f4)', action: 'account' },
      // { id: 9, icon: 'fas fa-bell', label: '通知设置', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', action: 'notifications' },
      // { id: 10, icon: 'fas fa-download', label: '下载管理', gradient: 'linear-gradient(135deg, #84fab0, #8fd3f4)', action: 'downloads' },
      // { id: 11, icon: 'fas fa-shield-alt', label: '隐私与安全', gradient: 'linear-gradient(135deg, #667eea, #764ba2)', action: 'privacy' }
    ]
  }
]);

// 计算属性：统计菜单总数
const totalMenuItems = computed(() => {
  return menuSections.reduce((sum, section) => sum + section.items.length, 0);
});

// 方法：处理菜单点击
const handleMenuClick = (action) => {
  console.log('点击了:', action);

  // 根据action进行路由跳转
  switch (action) {
    case 'article':
      router.push('/create-article');
      break;
    case 'articles':
      router.push('/my-articles');
      break;
    case 'project':
      router.push('/create-project');
      break;
    case 'projects':
      router.push('/my-projects');
      break;
    case 'account':
      showEditModal.value = true;
      break;
    default:
      console.log('暂未实现该功能');
  }
}

// 方法：处理退出登录
const handleLogout = async() => {
  console.log('退出登录');
  // 可添加确认弹窗和处理逻辑
  if (confirm('确定要退出登录吗？')) {
    // 执行退出逻辑
    try {
      const response = await request.post('/login/logout');
      if (response.data.message === 'success') {
        userStore.clearUserState();
        router.push('/');
      } else {
        throw new Error('退出登录失败')
      }
    } catch (error) {
      let errorMessage = '退出登录失败';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status) {
        errorMessage = error.response.statusText;
      } else {
        errorMessage = error.message;
      }
      console.error(`退出登录失败: ${errorMessage}`);
      alert('退出登录失败');
    }
  } else {
    // 取消操作
    return;
  }
};
</script>

<style scoped>
@import '/public/css/profile.css';

/* Vue3响应式列表动画 */
.menu-item {
  transition: all 0.3s ease;
}

.menu-item:hover {
  transform: translateX(clamp(5px, 1vw, 8px));
}

.menu-item:active {
  transform: scale(0.98);
}

/* 动态图标动画 */
.menu-icon i {
  transition: transform 0.3s ease;
}

.menu-item:hover .menu-icon i {
  transform: scale(1.2);
}
</style>