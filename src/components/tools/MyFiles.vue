<template>
  <div class="my-files">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2 class="page-title">
        <i :class="config.icon"></i>
        {{ config.title }}
      </h2>
      <button class="back-btn" @click="goBack">
        <i class="fas fa-arrow-left"></i>返回
      </button>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="filter-tabs">
        <button
          v-for="tab in filterTabs"
          :key="tab.value"
          class="filter-tab"
          :class="{ active: currentFilter === tab.value }"
          @click="currentFilter = tab.value"
        >
          <i :class="tab.icon"></i>
          {{ tab.label }}
        </button>
      </div>
      <div class="filter-right">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input
            type="text"
            v-model="searchKeyword"
            :placeholder="config.searchPlaceholder"
          />
          <button v-if="searchKeyword" class="clear-btn" @click="searchKeyword = ''">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <button class="create-btn" @click="createItem">
          <i class="fas fa-plus"></i>
          {{ config.createButtonText }}
        </button>
      </div>
    </div>

    <!-- 列表 -->
    <div class="files-list" v-if="filteredItems.length > 0">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="file-item"
        @click="viewItem(item.id)"
      >
        <div class="file-cover" v-if="item.coverName">
          <img :src="`/flask${item.coverName}`" :alt="config.coverAlt" />
        </div>
        <div class="file-cover placeholder" v-else>
          <i :class="config.placeholderIcon"></i>
        </div>
        <div class="file-content">
          <h3 class="file-title">{{ item.title }}</h3>
          <p class="file-summary">{{ item.intro }}</p>
          <div class="file-meta">
            <div class="meta-left">
              <span class="meta-item date">
                <i class="far fa-calendar-alt"></i>
                {{ item.createTime }}
              </span>
              <span class="meta-item views">
                <i class="far fa-eye"></i>
                {{ item.view }}
              </span>
              <span class="meta-item likes">
                <i class="far fa-heart"></i>
                {{ item.like }}
              </span>
              <span class="status-badge" :class="item.draft ? 'draft' : 'published'">
                {{ item.draft ? '草稿' : '已发布' }}
              </span>
            </div>
          </div>
        </div>
        <div class="file-actions">
          <button class="action-btn edit" @click.stop="editItem(item.id)" title="编辑">
            <i class="fas fa-pen"></i>
          </button>
          <button class="action-btn delete" @click.stop="deleteItem(item.id)" title="删除">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div class="empty-state" v-else>
      <div class="empty-icon">
        <i :class="config.emptyIcon"></i>
      </div>
      <p class="empty-text">{{ emptyText }}</p>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="totalPages > 1">
      <button
        class="page-btn"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button
        class="page-btn"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useUserStore } from '@/store/userStore';

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['articles', 'projects'].includes(value)
  }
});

const router = useRouter();
const userStore = useUserStore();

// 根据 type 获取配置
const config = computed(() => {
  const configs = {
    article: {
      title: '我的文章',
      icon: 'fas fa-book-open',
      searchPlaceholder: '搜索文章标题...',
      createButtonText: '写文章',
      emptyIcon: 'fas fa-file-alt',
      coverAlt: '文章封面',
      placeholderIcon: 'fas fa-image',
      apiEndpoint: '/data/my-articles',
      createRoute: '/create-article',
      editRoute: (id) => `/edit-article/${id}`,
      deleteEndpoint: (id) => `/article/${id}`,
      itemName: '文章'
    },
    project: {
      title: '我的项目',
      icon: 'fas fa-cubes',
      searchPlaceholder: '搜索项目名称...',
      createButtonText: '创建项目',
      emptyIcon: 'fas fa-cubes',
      coverAlt: '项目封面',
      placeholderIcon: 'fas fa-cube',
      apiEndpoint: '/data/my-projects',
      createRoute: '/create-project',
      editRoute: (id) => `/edit-project/${id}`,
      deleteEndpoint: (id) => `/project/${id}`,
      itemName: '项目'
    }
  };
  return configs[props.type];
});

// 筛选选项
const filterTabs = [
  { label: '全部', value: 'all', icon: 'fas fa-layer-group' },
  { label: '已发布', value: 'published', icon: 'fas fa-check-circle' },
  { label: '草稿', value: 'draft', icon: 'fas fa-edit' }
];

// 状态
const currentFilter = ref('all');
const searchKeyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const items = ref([]);

// 计算属性
const filteredItems = computed(() => {
  let result = items.value;
  
  // 状态筛选
  if (currentFilter.value !== 'all') {
    result = result.filter(item => {
      if (currentFilter.value === 'draft') return item.draft;
      if (currentFilter.value === 'published') return !item.draft;
      return true;
    });
  }
  
  // 关键词搜索
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase();
    result = result.filter(item => 
      item.title.toLowerCase().includes(keyword)
    );
  }
  
  return result;
});

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value));

const emptyText = computed(() => {
  if (searchKeyword.value) return `没有找到匹配的${config.value.itemName}`;
  if (currentFilter.value === 'draft') return '暂无草稿';
  if (currentFilter.value === 'published') return `暂无已发布${config.value.itemName}`;
  return `还没有${props.type === 'articles' ? '写' : '创建'}${config.value.itemName}，开始创作吧！`;
});

// 方法
const goBack = () => {
  router.back();
};

const createItem = () => {
  router.push(config.value.createRoute);
};

const viewItem = (id) => {
  router.push({ name: 'detail', params: { id: `${props.type}-${id}` } });
};

const editItem = (id) => {
  router.push(config.value.editRoute(id));
};

const deleteItem = async (id) => {
  if (!confirm(`确定要删除这个${config.value.itemName}吗？此操作不可恢复。`)) {
    return;
  }
  try {
    await request.delete(config.value.deleteEndpoint(id));
    // 重新加载数据
    await loadItems();
  } catch (error) {
    alert('删除失败，请重试');
  }
};

// 加载列表
const loadItems = async () => {
  try {
    const response = await axios.post('/flask/data/my-items', {
      headers: {
        'Content-Type': 'application/json'
      },
      type: props.type,
      userId: userStore.userInfo.id
    });
    items.value = response.data.items || [];
    totalCount.value = response.data.total || 0;
  } catch (error) {
    console.error(`加载${config.value.itemName}失败:`, error);
    items.value = [];
    totalCount.value = 0;
    let errorMessage = '加载失败，请重试';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.status) {
      errorMessage = error.response.statusText;
    } else {
      errorMessage = error.message;
    }
    alert(errorMessage);
  }
};

// 初始化
onMounted(() => {
  loadItems();
});
</script>

<style scoped>
@import '/public/css/my-files';
</style>
