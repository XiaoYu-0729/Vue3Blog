<template>
  <div class="home-content">
    <!-- 分类选项卡 + 搜索栏 + 提示（同一行） -->
    <div class="category-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-btn"
        :class="{ active: selectedTab === tab.value }"
        @click="switchTab(tab.value)"
      >
        <i :class="tab.icon"></i>
        {{ tab.label }}
      </button>

      <!-- 搜索栏（位于项目按钮之后，提示之前） -->
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input
          type="text"
          placeholder="搜索文章或项目..."
          v-model="searchQuery"
          @input="handleSearch"
        />
        <button v-if="searchQuery" class="clear-search" @click="clearSearch">
          <i class="fas fa-times-circle"></i>
        </button>
      </div>

      <!-- 选中提示（显示当前分类及匹配数量） -->
      <span class="tab-hint" v-if="hintText">
        <i class="fas fa-info-circle"></i> {{ hintText }}
        <span class="hint-count" v-if="filteredItems.length > 0">
          （{{ filteredItems.length }} 项）
        </span>
      </span>
    </div>

    <!-- 分类内容列表 -->
    <div class="content-list">
      <transition-group name="list" tag="div">
        <article
          v-for="item in filteredItems"
          :key="item.id"
          class="content-card"
          @click="goToDetail(item.id)"
        >
          <h3>{{ item.title }}</h3>
          <p>{{ item.intro }}</p>
          <div class="card-meta">
            <span class="type-badge" :class="item.type">
              <i :class="item.type === 'article' ? 'fas fa-file-alt' : 'fas fa-project-diagram'"></i>
              {{ item.type === 'article' ? '文章' : '项目' }}
            </span>
            <span class="date"><i class="far fa-calendar-alt"></i> {{ item.createTime }}</span>
          </div>
        </article>
      </transition-group>
      <div v-if="filteredItems.length === 0" class="empty-state">
        <i class="fas fa-folder-open"></i>
        <p>没有找到匹配的内容</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchHomeData, combineData } from '@/config/request';
import { shuffleArray } from '@/config/tools';

const router = useRouter();

// 选项卡定义
const tabs = [
  { label: '全部', value: 'all', icon: 'fas fa-layer-group' },
  { label: '文章', value: 'article', icon: 'fas fa-file-alt' },
  { label: '项目', value: 'project', icon: 'fas fa-project-diagram' }
];

const selectedTab = ref('all');
const searchQuery = ref('');
const hintText = ref('当前显示：全部');

// 模拟数据（可根据实际需求替换）
const items = ref([]);

// 加载完成后获取数据
onMounted( async () => {
  try {
    const data = await fetchHomeData();
    const mergedData = combineData(data['articles'], data['projects']);
    items.value = shuffleArray(mergedData);
  } catch (error) {
    console.error('数据加载失败:', error);
    alert('数据加载失败，请稍后再试');
  }
});

// 方法
const switchTab = (tabValue) => {
  selectedTab.value = tabValue;
  updateHint();
};

const updateHint = () => {
  const tab = tabs.find(t => t.value === selectedTab.value);
  const base = tab ? tab.label : '';
  hintText.value = `当前显示：${base}`;
};

const handleSearch = () => {};

const clearSearch = () => {
  searchQuery.value = '';
};

// 跳转详情页
const goToDetail = (id) => {
  router.push({ name: 'detail', params: { id } });
};

// 计算属性
const filteredItems = computed(() => {
  let result = items.value;
  if (selectedTab.value !== 'all') {
    result = result.filter(item => item.type === selectedTab.value);
  }
  if (searchQuery.value.trim() !== '') {
    const keyword = searchQuery.value.trim().toLowerCase();
    result = result.filter(item =>
      item.title.toLowerCase().includes(keyword) ||
      item.intro.toLowerCase().includes(keyword)
    );
  }
  return result;
});

watch(selectedTab, updateHint, { immediate: true });
</script>

<style scoped>
@import '/public/css/home.css';
</style>