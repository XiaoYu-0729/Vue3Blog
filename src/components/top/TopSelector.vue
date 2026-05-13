<template>
  <div class="nav-selector" :class="{ open: dropdownOpen }">
    <!-- 触发按钮 -->
    <div class="selector-trigger" @click="toggleDropdown">
      <i :class="currentIcon"></i>
      <span class="selector-label">{{ currentLabel }}</span>
      <i class="fas fa-chevron-down selector-arrow"></i>
    </div>
    
    <!-- 下拉菜单 -->
    <!-- 移动端且处于创建文章/创建项目页面时不显示 -->
    <ul class="selector-menu" v-show="dropdownOpen && !isCreatePage">
      <li 
        v-for="item in navItems" 
        :key="item.path"
        class="selector-item"
        :class="{ active: selectedPath === item.path }"
        @click="selectItem(item.path)"
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
        <i class="fas fa-check check-icon" v-if="selectedPath === item.path"></i>
      </li>
    </ul>
    
    <!-- 点击外部关闭 -->
    <div class="selector-overlay" v-show="dropdownOpen" @click="dropdownOpen = false"></div>
  </div>
</template>

<script>
export default {
  name: 'NavSelector',
  data() {
    return {
      selectedPath: '',
      dropdownOpen: false,
      navItems: [
        { path: '/', label: '首页', icon: 'fas fa-home' },
        { path: '/discover', label: '发现', icon: 'fas fa-compass' },
        { path: '/notification', label: '通知', icon: 'fas fa-bell' },
        { path: '/more', label: '更多', icon: 'fas fa-ellipsis-h' },
        { path: '/profile', label: '我的', icon: 'fas fa-user' }
      ]
    }
  },
  computed: {
    currentItem() {
      return this.navItems.find(item => item.path === this.selectedPath) || this.navItems[0]
    },
    currentLabel() {
      return this.currentItem.label
    },
    currentIcon() {
      return this.currentItem.icon
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        this.selectedPath = to.path
      }
    }
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen
    },
    selectItem(path) {
      this.selectedPath = path
      this.dropdownOpen = false
      if (this.$route.path !== path) {
        this.$router.push(path)
      }
    }
  }
}
</script>

<style scoped>
.nav-selector {
  position: relative;
  display: inline-block;
  z-index: 50;
}

/* 触发按钮 - 粉紫渐变 */
.selector-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 24px;
  padding: 8px 16px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  backdrop-filter: blur(4px);
}

.selector-trigger:hover {
  background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 100%);
  border-color: rgba(255,255,255,0.5);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(185, 131, 255, 0.3);
}

.selector-trigger i:first-child {
  font-size: 14px;
}

.selector-label {
  min-width: 28px;
}

.selector-arrow {
  font-size: 10px;
  transition: transform 0.25s ease;
  opacity: 0.8;
}

.nav-selector.open .selector-arrow {
  transform: rotate(180deg);
}

.nav-selector.open .selector-trigger {
  background: linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.2) 100%);
  border-color: rgba(255,255,255,0.6);
  box-shadow: 0 4px 16px rgba(185, 131, 255, 0.4);
}

/* 下拉菜单 */
.selector-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 120px;
  width: max-content;
  background: rgba(255, 245, 250, 0.98);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(230, 150, 255, 0.5);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(156, 76, 226, 0.35);
  list-style: none;
  padding: 6px;
  margin: 0;
  z-index: 100;
  overflow: hidden;
  animation: menuSlide 0.2s ease;
}

@keyframes menuSlide {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 菜单项 */
.selector-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  color: #4a2c5f;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.selector-item:hover {
  background: linear-gradient(135deg, rgba(185, 131, 255, 0.2) 0%, rgba(255, 158, 239, 0.15) 100%);
  padding-left: 16px;
}

.selector-item i:first-child {
  width: 16px;
  text-align: center;
  color: #b556d4;
  font-size: 13px;
}

.selector-item.active {
  background: linear-gradient(135deg, #b983ff 0%, #ff9cef 100%);
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(185, 131, 255, 0.4);
}

.selector-item.active i:first-child {
  color: white;
}

.check-icon {
  margin-left: auto;
  font-size: 12px;
  opacity: 0.9;
}

/* 遮罩层 */
.selector-overlay {
  position: fixed;
  inset: 0;
  z-index: 49;
}
</style>
