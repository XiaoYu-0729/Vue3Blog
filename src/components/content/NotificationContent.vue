<template>
  <div class="notification-content">
    <!-- 装饰背景 -->
    <div class="decorative-bg">
      <div class="decor-circle circle-1"></div>
      <div class="decor-circle circle-2"></div>
    </div>

    <!-- 通知标题 -->
    <div class="notif-header">
      <h2>通知消息</h2>
      <button class="mark-read-btn" @click="markAllRead">全部已读</button>
    </div>

    <!-- 通知筛选选择框 -->
    <!-- <div class="notif-tabs">
      <div class="custom-dropdown" :class="{ open: dropdownOpen }">
        <div class="dropdown-trigger" @click="dropdownOpen = !dropdownOpen">
          <span class="dropdown-value">{{ currentTabLabel }}</span>
          <i class="fas fa-chevron-down dropdown-arrow"></i>
        </div>
        <ul class="dropdown-menu" v-show="dropdownOpen">
          <li 
            v-for="tab in tabs" 
            :key="tab.value"
            class="dropdown-item"
            :class="{ active: activeTab === tab.value }"
            @click="selectTab(tab.value)"
          >
            <span>{{ tab.label }}</span>
            <span class="item-badge" v-if="getUnreadCount(tab.value) > 0">{{ getUnreadCount(tab.value) }}</span>
          </li>
        </ul>
      </div>
    </div> -->

    <!-- 通知列表 -->
    <div class="notif-list">
      <template v-if="filteredNotifications.length > 0">
        <div 
          v-for="item in filteredNotifications" 
          :key="item.id"
          class="notif-item"
          :class="{ unread: !item.read }"
          @click="handleClick(item)"
        >
          <div class="notif-icon" :style="{ background: item.iconBg }">
            <i :class="item.icon"></i>
          </div>
          <div class="notif-body">
            <div class="notif-title">{{ item.title }}</div>
            <div class="notif-desc">{{ item.desc }}</div>
            <div class="notif-time">{{ item.time }}</div>
          </div>
          <div class="unread-dot" v-if="!item.read"></div>
        </div>
      </template>
      <div v-else class="empty-state">
        <i class="fas fa-bell-slash"></i>
        <p>暂无通知</p>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="notif-footer">
      <p>© 2025 雨落筱然</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const activeTab = ref('all');
const dropdownOpen = ref(false);

const currentTabLabel = computed(() => {
  const tab = tabs.find(t => t.value === activeTab.value);
  const count = getUnreadCount(activeTab.value);
  return tab ? `${tab.label}${count > 0 ? ` (${count})` : ''}` : '';
});

const selectTab = (value) => {
  activeTab.value = value;
  dropdownOpen.value = false;
};

const tabs = [
  { label: '全部', value: 'all' },
  { label: '有赞', value: 'like' },
  { label: '评论', value: 'comment' },
  { label: '系统', value: 'system' }
];

const notifications = ref([
  {
    id: 1,
    type: 'like',
    title: '点赞提醒',
    desc: '「Vue3 组合式API实战」等文章和项目收到了 23 个赞',
    time: '2分钟前',
    icon: 'fas fa-heart',
    iconBg: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)',
    read: false
  },
  {
    id: 2,
    type: 'comment',
    title: '新评论提醒',
    desc: '用户"前端小白"评论了你的文章「响应式原理与实现」',
    time: '15分钟前',
    icon: 'fas fa-comment',
    iconBg: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    read: false
  },
  {
    id: 3,
    type: 'comment',
    title: '回复通知',
    desc: '用户"技术达人"回复了你的评论',
    time: '昨天',
    icon: 'fas fa-comment-dots',
    iconBg: 'linear-gradient(135deg, #84fab0, #8fd3f4)',
    read: true
  },
  {
    id: 4,
    type: 'system',
    title: '系统更新通知',
    desc: '网站已升级至 V1.1.0 版本，新增多项功能',
    time: '1小时前',
    icon: 'fas fa-cog',
    iconBg: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    read: false
  },
  {
    id: 5,
    type: 'system',
    title: '账号安全提醒',
    desc: '你的账号在新设备登录，请确认是否为本人操作',
    time: '昨天',
    icon: 'fas fa-shield-alt',
    iconBg: 'linear-gradient(135deg, #667eea, #764ba2)',
    read: true
  }
]);

const filteredNotifications = computed(() => {
  if (activeTab.value === 'all') {
    return notifications.value;
  }
  return notifications.value.filter(item => item.type === activeTab.value);
});

const getUnreadCount = (type) => {
  if (type === 'all') {
    return notifications.value.filter(item => !item.read).length;
  }
  return notifications.value.filter(item => item.type === type && !item.read).length;
};

const handleClick = (item) => {
  item.read = true;
  console.log('点击通知:', item.title);
};

const markAllRead = () => {
  notifications.value.forEach(item => item.read = true);
};
</script>

<style scoped>
.notification-content {
  position: relative;
  overflow: hidden;
}

/* 装饰背景 */
.decorative-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.decor-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.12;
}

.circle-1 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #b983ff, #ff9cef);
  top: -60px;
  right: -40px;
}

.circle-2 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #b983ff, #ff9cef);
  bottom: 100px;
  left: -30px;
}

/* 通知头部 */
.notif-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.notif-header h2 {
  color: #8816b5;
  font-size: 1.5rem;
  margin: 0;
}

.mark-read-btn {
  background: linear-gradient(135deg, #b983ff 0%, #ff9cef 100%);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(156, 76, 226, 0.3);
}

.mark-read-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(156, 76, 226, 0.4);
}

/* 通知标签选择框 - 自定义下拉菜单 */
.notif-tabs {
  margin-bottom: 20px;
}

.custom-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: linear-gradient(135deg, #b983ff 0%, #ff9cef 100%);
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 0.9rem;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(156, 76, 226, 0.3);
  min-width: 140px;
}

.dropdown-trigger:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(156, 76, 226, 0.4);
}

.dropdown-value {
  font-weight: 500;
}

.dropdown-arrow {
  font-size: 12px;
  transition: transform 0.2s;
}

.custom-dropdown.open .dropdown-arrow {
  transform: rotate(180deg);
}

/* 下拉菜单选项 */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 100%;
  background: rgba(255, 245, 250, 0.98);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(230, 150, 255, 0.5);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(156, 76, 226, 0.3);
  list-style: none;
  padding: 6px;
  margin: 0;
  z-index: 100;
  overflow: hidden;
  animation: dropdownFade 0.2s ease;
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 12px;
  color: #4a2c5f;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.15s;
}

.dropdown-item:hover {
  background: rgba(185, 131, 255, 0.2);
}

.dropdown-item.active {
  background: linear-gradient(135deg, #b983ff 0%, #ff9cef 100%);
  color: white;
  font-weight: 500;
}

.item-badge {
  background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
  color: white;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.dropdown-item.active .item-badge {
  background: white;
  color: #b983ff;
}

/* 通知列表 */
.notif-list {
  background: rgba(255, 245, 250, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(230, 150, 255, 0.5);
  box-shadow: 0 8px 16px -8px rgba(150, 80, 200, 0.2);
}

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid rgba(230, 150, 255, 0.2);
  position: relative;
}

.notif-item:last-child {
  border-bottom: none;
}

.notif-item:hover {
  background: rgba(220, 180, 255, 0.3);
}

.notif-item.unread {
  background: rgba(243, 232, 255, 0.5);
}

.notif-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.notif-icon i {
  font-size: 1.1rem;
  color: white;
}

.notif-body {
  flex: 1;
  min-width: 0;
}

.notif-title {
  color: #4a2c5f;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 4px;
}

.notif-desc {
  color: #6b4a7a;
  font-size: 0.85rem;
  line-height: 1.4;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notif-time {
  color: #b556d4;
  font-size: 0.8rem;
}

.unread-dot {
  width: 10px;
  height: 10px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 6px;
  box-shadow: 0 2px 4px rgba(255, 107, 107, 0.4);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 48px 20px;
  color: #b556d4;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 1rem;
}

/* 底部信息 */
.notif-footer {
  text-align: center;
  padding: 24px 20px;
  color: #b556d4;
  font-size: 0.85rem;
}

.notif-footer p {
  margin: 0;
}

/* 响应式 */
@media (max-width: 600px) {
  .notif-header {
    flex-direction: row;
    gap: 12px;
    align-items: flex-start;
  }
  
  .custom-dropdown {
    width: 100%;
  }
  
  .dropdown-trigger {
    width: 100%;
    justify-content: space-between;
  }

  /* 禁用全部已读按钮动画 */
  .mark-read-btn {
    transition: none !important;
    transform: none !important;
  }
  .mark-read-btn:hover {
    transform: none !important;
  }

  /* 移除移动端点击高亮框 */
  .mark-read-btn {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }
}
</style>