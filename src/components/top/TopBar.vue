<template>
    <!-- 顶栏区域 -->
    <nav class="top-nav">
        <RouterLink to="/" exact-active-class="active">
          <i class="fas fa-home"></i> 首页
        </RouterLink>
        <RouterLink to="/discover" exact-active-class="active">
          <i class="fas fa-compass"></i> 发现
        </RouterLink>
        <RouterLink to="/notification" exact-active-class="active">
          <i class="fas fa-bell"></i> 通知
        </RouterLink>
        <RouterLink to="/more" exact-active-class="active">
          <i class="fas fa-ellipsis-h"></i> 更多
        </RouterLink>
        <RouterLink to="/profile" exact-active-class="active">
          <i class="fas fa-user"></i> 我的
        </RouterLink>
    </nav>
</template>
<style scoped>
/* 导航链接样式 - 需要使用:deep()穿透 */
.top-nav :deep(a) {
  color: white;
  text-decoration: none;
  margin-left: clamp(16px, 2.3vw, 28px);
  font-weight: 500;
  opacity: 0.9;
  transition: opacity 0.2s, transform 0.2s;
  display: inline-block;
  font-size: clamp(0.85rem, 1.2vw, 1rem);
}

.top-nav :deep(a:hover) {
  opacity: 1;
  transform: translateY(clamp(-1px, -0.1vh, -1px));
}

/* 激活样式：粉紫色下划线 + 加粗 */
.top-nav :deep(a.active),
.top-nav :deep(a.router-link-active) {
  font-weight: 600;
  position: relative;
  color: white !important;
  text-shadow: 0 0 clamp(4px, 0.8vw, 8px) rgba(255, 255, 255, 0.5);
}
.top-nav :deep(a.active::after),
.top-nav :deep(a.router-link-active::after) {
  content: '';
  position: absolute;
  bottom: clamp(-3px, -0.4vw, -4px);
  left: 0;
  width: 100%;
  height: clamp(2px, 0.3vw, 3px);
  background: linear-gradient(90deg, #ffffff, #ffd0fb);
  border-radius: clamp(1px, 0.2vw, 2px);
  box-shadow: 0 0 clamp(4px, 0.8vw, 8px) #ffa0f0;
}
</style>
