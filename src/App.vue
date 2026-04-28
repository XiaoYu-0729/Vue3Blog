<template>
  <div class="app" @click="handleClickOutside">
    <!-- 顶栏区域 -->
    <header class="top-bar">
      <div class="top-bar-inner">
        <span class="logo"><i class="fas fa-cloud"></i> 雨落筱然</span>
        <!-- 响应式切换：移动端显示NavSelector，桌面端显示TopBar -->
        <TopSelector v-if="isMobile && !isCreatePage"></TopSelector>
        <TopBar v-else-if="!isMobile || !isCreatePage"></TopBar>
      </div>
    </header>

    <!-- 智能体子组件 -->
    <Agent ref="agentTools"></Agent>

    <!-- 主要内容区域：可滚动 -->
    <main class="content">
      <div class="content-inner">
        <!-- 移动端或详情页：无边框容器 -->
        <div v-if="isMobile || route.name === 'detail'">
          <router-view v-slot="{ Component }">
            <transition name="fade-scale" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
        <!-- 桌面端非详情页：带边框容器 -->
        <section class="demo-section" v-else>
          <router-view v-slot="{ Component }">
            <transition name="fade-scale" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import TopBar from './components/top/TopBar.vue';
import Agent from './components/tools/Agent.vue';
import TopSelector from './components/top/TopSelector.vue';
import { isMobile, isCreatePage, checkMobile, setRouteName } from './config/tools';
import router from './config';

const route = useRoute();
const agentTools = ref(null);

// 同步路由名称到 tools.js
watch(() => route.name, (newName) => {
    setRouteName(newName);
}, { immediate: true });

// 监听路由变化，自动滚动到顶部
watch(() => route.path, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const contentEl = document.querySelector('.content');
  if (contentEl) {
    contentEl.scrollTop = 0;
  }
});

// 点击外部关闭智能体卡片
const handleClickOutside = (event) => {
  if (agentTools.value && agentTools.value.showAgentCard) {
    const target = event.target;
    const isAgentElement = target.closest('.agent-ball') || target.closest('.agent-card');
    if (!isAgentElement) {
      agentTools.value.toggleAgentCard();
    }
  }
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>
<style scoped> 

/* 滚动条粉紫色样式 */
.content::-webkit-scrollbar {
  width: 8px !important;
  height: 8px !important;
}
.content::-webkit-scrollbar-track {
  background: #f2d9ff !important;
  border-radius: 8px;
}
.content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #ca9eff, #ffa2de) !important;
  border-radius: 8px !important;
  border: 2px solid #f7d0ff;
}
.content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #b57cff, #ff85d0) !important;
}
</style>