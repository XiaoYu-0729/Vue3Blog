<template>
  <!-- 登录区域 -->
  <div v-if="route.name === 'login' || route.name === 'register'">
    <RouterView v-slot="{ Component }">
      <transition name="fade-scale" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </div>
  
  <!-- 主应用区域 -->
  <div class="app" @click="handleClickOutside" v-else>
    <header class="top-bar">
      <div class="top-bar-inner">
        <span class="logo"><i class="fas fa-cloud"></i> 雨落筱然</span>
        <TopSelector v-if="isMobile && !isPage"></TopSelector>
        <TopBar v-else-if="!isMobile || !isPage"></TopBar>
      </div>
    </header>

    <!-- 智能体 -->
    <Agent ref="agentTools"></Agent>

    <main class="content">
      <div class="content-inner">
        <div v-if="isMobile || route.name === 'detail'">
          <RouterView v-slot="{ Component }">
            <transition name="fade-scale" mode="out-in">
              <component :is="Component" />
            </transition>
          </RouterView>
        </div>
        <section class="demo-section" v-else>
          <RouterView v-slot="{ Component }">
            <transition name="fade-scale" mode="out-in">
              <component :is="Component" />
            </transition>
          </RouterView>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import TopBar from './components/top/TopBar.vue';
import Agent from './components/tools/Agent.vue';
import TopSelector from './components/top/TopSelector.vue';
import { isMobile, isPage, checkMobile, setRouteName } from './config/tools';

const route = useRoute();
const agentTools = ref(null);

watch(() => route.name, (newName) => {
    setRouteName(newName);
}, { immediate: true });

watch(() => route.path, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const contentEl = document.querySelector('.content');
  if (contentEl) {
    contentEl.scrollTop = 0;
  }
});

const handleClickOutside = (event) => {
  if (agentTools.value && agentTools.value.showAgentCard) {
    const target = event.target;
    const isAgentElement = target.closest('.agent-ball') || target.closest('.agent-card');
    if (!isAgentElement) {
      agentTools.value.toggleAgentCard();
    }
  }
};

onMounted(async () => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>
<style>
::-webkit-scrollbar {
  width: clamp(5px, 0.8vw, 8px);
  height: clamp(5px, 0.8vw, 8px);
}
::-webkit-scrollbar-track {
  background: #f2d9ff;
  border-radius: clamp(5px, 0.8vw, 8px);
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #ca9eff, #ffa2de);
  border-radius: clamp(5px, 0.8vw, 8px);
  border: clamp(1px, 0.2vw, 2px) solid #f7d0ff;
}
::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #b57cff, #ff85d0);
}
</style>

<style scoped>
.content::-webkit-scrollbar {
  width: clamp(5px, 0.8vw, 8px) !important;
  height: clamp(5px, 0.8vw, 8px) !important;
}
.content::-webkit-scrollbar-track {
  background: #f2d9ff !important;
  border-radius: clamp(5px, 0.8vw, 8px);
}
.content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #ca9eff, #ffa2de) !important;
  border-radius: clamp(5px, 0.8vw, 8px) !important;
  border: clamp(1px, 0.2vw, 2px) solid #f7d0ff;
}
.content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #b57cff, #ff85d0) !important;
}
</style>
