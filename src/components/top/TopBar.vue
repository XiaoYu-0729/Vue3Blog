<template>
    <!-- 顶栏区域 -->
    <nav class="top-nav">
        <router-link to="/" exact-active-class="active">
          <i class="fas fa-home"></i> 首页
        </router-link>
        <router-link to="/discover" exact-active-class="active">
          <i class="fas fa-compass"></i> 发现
        </router-link>
        <router-link to="/notification" exact-active-class="active">
          <i class="fas fa-bell"></i> 通知
        </router-link>
        <router-link to="/more" exact-active-class="active">
          <i class="fas fa-ellipsis-h"></i> 更多
        </router-link>
        <router-link to="/profile" exact-active-class="active">
          <i class="fas fa-user"></i> 我的
        </router-link>
    </nav>
</template>
<style scoped>
/* 导航链接样式 - 需要使用:deep()穿透 */
.top-nav :deep(a) {
  color: white;
  text-decoration: none;
  margin-left: 28px;
  font-weight: 500;
  opacity: 0.9;
  transition: opacity 0.2s, transform 0.2s;
  display: inline-block;
}

.top-nav :deep(a:hover) {
  opacity: 1;
  transform: translateY(-1px);
}

/* 激活样式：粉紫色下划线 + 加粗 */
.top-nav :deep(a.active),
.top-nav :deep(a.router-link-active) {
  font-weight: 600;
  position: relative;
  color: white !important;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}
.top-nav :deep(a.active::after),
.top-nav :deep(a.router-link-active::after) {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #ffffff, #ffd0fb);
  border-radius: 2px;
  box-shadow: 0 0 8px #ffa0f0;
}
</style>