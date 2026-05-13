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
        <div class="file-cover" v-if="item.cover">
          <img :src="item.cover" :alt="config.coverAlt" />
        </div>
        <div class="file-cover placeholder" v-else>
          <i :class="config.placeholderIcon"></i>
        </div>
        <div class="file-content">
          <h3 class="file-title">{{ item.title }}</h3>
          <p class="file-summary">{{ item.summary }}</p>
          <div class="file-meta">
            <div class="meta-left">
              <span class="meta-item date">
                <i class="far fa-calendar-alt"></i>
                {{ item.createTime }}
              </span>
              <span class="meta-item views">
                <i class="far fa-eye"></i>
                {{ item.views }}
              </span>
              <span class="meta-item likes">
                <i class="far fa-heart"></i>
                {{ item.likes }}
              </span>
              <span class="status-badge" :class="item.status">
                {{ item.status === 'published' ? '已发布' : '草稿' }}
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
      <button class="empty-action" @click="createItem">
        <i class="fas fa-plus"></i>
        {{ config.emptyButtonText }}
      </button>
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
import { request } from '@/config/request';

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['articles', 'projects'].includes(value)
  }
});

const router = useRouter();

// 根据 type 获取配置
const config = computed(() => {
  const configs = {
    articles: {
      title: '我的文章',
      icon: 'fas fa-book-open',
      searchPlaceholder: '搜索文章标题...',
      createButtonText: '写文章',
      emptyIcon: 'fas fa-file-alt',
      emptyButtonText: '写第一篇文章',
      coverAlt: '文章封面',
      placeholderIcon: 'fas fa-image',
      apiEndpoint: '/my/articles',
      createRoute: '/create-article',
      editRoute: (id) => `/edit-article/${id}`,
      deleteEndpoint: (id) => `/article/${id}`,
      itemName: '文章'
    },
    projects: {
      title: '我的项目',
      icon: 'fas fa-cubes',
      searchPlaceholder: '搜索项目名称...',
      createButtonText: '创建项目',
      emptyIcon: 'fas fa-cubes',
      emptyButtonText: '创建第一个项目',
      coverAlt: '项目封面',
      placeholderIcon: 'fas fa-cube',
      apiEndpoint: '/my/projects',
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
    result = result.filter(item => item.status === currentFilter.value);
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
  router.push({ name: 'detail', params: { id } });
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
    const response = await request.get(config.value.apiEndpoint, {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value
      }
    });
    items.value = response.data.items || response.data.articles || response.data.projects || [];
    totalCount.value = response.data.total || 0;
  } catch (error) {
    console.error(`加载${config.value.itemName}失败:`, error);
    // 使用模拟数据
    if (props.type === 'articles') {
      items.value = [
        {
          id: 1,
          title: 'Vue3 组合式 API 最佳实践',
          summary: '深入探讨 Vue3 Composition API 的使用技巧和注意事项...',
          cover: '',
          createTime: '2025-05-10',
          views: 128,
          likes: 32,
          status: 'published'
        },
        {
          id: 2,
          title: '前端性能优化指南',
          summary: '从加载速度到运行效率，全面提升前端应用性能...',
          cover: '',
          createTime: '2025-05-08',
          views: 86,
          likes: 18,
          status: 'published'
        },
        {
          id: 3,
          title: 'TypeScript 高级类型技巧',
          summary: '掌握 TypeScript 的高级类型系统，写出更健壮的代码...',
          cover: '',
          createTime: '2025-05-05',
          views: 0,
          likes: 0,
          status: 'draft'
        }
      ];
    } else {
      items.value = [
        {
          id: 1,
          title: '个人博客系统',
          summary: '基于 Vue3 + Flask 的全栈博客项目，支持文章发布、项目管理等功能...',
          cover: '',
          createTime: '2025-05-10',
          views: 256,
          likes: 48,
          status: 'published'
        },
        {
          id: 2,
          title: '任务管理工具',
          summary: '一个简洁高效的任务管理应用，支持拖拽排序、标签分类等功能...',
          cover: '',
          createTime: '2025-05-08',
          views: 128,
          likes: 24,
          status: 'published'
        },
        {
          id: 3,
          title: '在线代码编辑器',
          summary: '支持多种编程语言的在线代码编辑器，具有语法高亮、自动补全等功能...',
          cover: '',
          createTime: '2025-05-05',
          views: 0,
          likes: 0,
          status: 'draft'
        }
      ];
    }
    totalCount.value = 3;
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
