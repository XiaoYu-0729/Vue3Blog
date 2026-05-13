<template>
  <div class="detail-page">
    <!-- 文章详情卡片 -->
    <article class="detail-card">
      <!-- 头部信息 -->
      <header class="detail-header">
        <!-- 返回按钮（右上角） -->
        <button class="back-btn" @click="goBack">
          <i class="fas fa-arrow-left"></i>
          <span>返回</span>
        </button>

        <!-- 元信息 -->
        <div class="detail-meta">
          <div class="author-info">
            <img class="author-avatar" :src="userData.avatar ? `/flask${userData.avatar}` : '/image/默认头像.jpg'" alt="用户头像">
            <span class="author-name">{{ userData.nickname || '匿名用户' }}</span>
          </div>
          <div class="meta-right">
            <span class="type-badge" :class="contentData.type">
              <i :class="contentData.type === 'article' ? 'fas fa-file-alt' : 'fas fa-project-diagram'"></i>
              {{ contentData.type === 'article' ? '文章' : '项目' }}
            </span>
            <span class="meta-date">
              <i class="far fa-calendar-alt"></i>
              {{ contentData.createTime }}
            </span>
          </div>
        </div>

        <h1 class="detail-title">{{ contentData.title }}</h1>
        <p class="detail-intro">{{ contentData.intro }}</p>

        <!-- 项目技术栈 -->
        <div v-if="contentData.type === 'project' && contentData.techStack" class="tech-stack">
          <span class="tech-label"><i class="fas fa-code"></i> 技术栈:</span>
          <div class="tech-tags">
            <span 
              v-for="(tech, index) in contentData.techStack" 
              :key="index"
              class="tech-tag"
            >
              {{ tech }}
            </span>
          </div>
        </div>
      </header>

      <!-- 内容主体 -->
      <div class="detail-body">
        <div class="content-text" v-html="renderedContent"></div>
        <FilesList :files="contentData.files"></FilesList>
        <!-- 互动按钮栏 -->
        <div class="action-bar">
          <button 
            class="action-btn like-btn" 
            :class="{ active: isLiked }"
            @click="toggleLike"
          >
            <i :class="isLiked ? 'fas fa-heart' : 'far fa-heart'"></i>
            <span>{{ likeCount }}</span>
          </button>
          
          <button 
            class="action-btn collect-btn" 
            :class="{ active: isCollected }"
            @click="toggleCollect"
          >
            <i :class="isCollected ? 'fas fa-star' : 'far fa-star'"></i>
            <span>{{ collectCount }}</span>
          </button>
          
          <button 
            class="action-btn comment-btn"
            @click="scrollToComments"
          >
            <i class="far fa-comment"></i>
            <span>{{ comments.length }}</span>
          </button>
          
          <button class="action-btn share-btn" @click="shareContent">
            <i class="fas fa-share-alt"></i>
            <span>分享</span>
          </button>
        </div>
      </div>

      <!-- 评论区 -->
      <section class="comments-section" ref="commentsSection">
        <div class="comments-header">
          <h3 class="comments-title">
            <i class="far fa-comments"></i>
            评论 ({{ comments.length }})
          </h3>
        </div>

        <!-- 发表评论 -->
        <div class="comment-form">
          <div class="comment-input-wrapper">
            <textarea
              v-model="newComment"
              placeholder="写下你的想法..."
              rows="2"
              @keydown.ctrl.enter="submitComment"
            ></textarea>
            <button 
              class="submit-btn" 
              @click="submitComment"
              :disabled="!newComment.trim()"
            >
              <i class="fas fa-paper-plane"></i>
              <span>发布</span>
            </button>
          </div>
        </div>

        <!-- 评论列表 -->
        <div class="comments-list">
          <div 
            v-for="(comment, index) in comments" 
            :key="comment.id"
            class="comment-item"
          >
            <div class="comment-avatar">
              <i class="fas fa-user-circle"></i>
            </div>
            <div class="comment-content">
              <div class="comment-header-row">
                <span class="comment-author">{{ comment.author }}</span>
                <span class="comment-time">{{ comment.time }}</span>
              </div>
              <p class="comment-text">{{ comment.text }}</p>
              <div class="comment-actions">
                <button 
                  class="comment-action-btn"
                  @click="toggleCommentLike(index)"
                >
                  <i :class="comment.liked ? 'fas fa-thumbs-up' : 'far fa-thumbs-up'"></i>
                  <span>{{ comment.likes }}</span>
                </button>
                <button class="comment-action-btn" @click="replyToComment(comment)">
                  <i class="far fa-reply"></i>
                  <span>回复</span>
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="comments.length === 0" class="no-comments">
            <i class="far fa-comment-dots"></i>
            <p>暂无评论，快来抢沙发吧~</p>
          </div>
        </div>
      </section>
    </article>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { getDetailPage } from '@/config/request';
import FilesList from '../tools/FilesList.vue';

const router = useRouter();
const commentsSection = ref(null);
const props = defineProps(['id']);
const userData = ref({
  nickname: undefined,
  avatar: undefined
});

// 内容数据
const contentData = ref({
  title: 'Vue3 + Vite 项目实战指南',
  intro: '深入探索 Vue3 组合式 API 与 Vite 构建工具的最佳实践，打造现代化前端应用。',
  content: `## 前言

Vue3 带来了全新的组合式 API，让代码组织更加灵活。配合 Vite 的极速构建体验，开发效率大幅提升。

## 核心特性

### 1. 组合式 API
- **setup 函数**：组件的逻辑入口
- **响应式 API**：ref 和 reactive
- **生命周期**：onMounted, onUpdated 等

### 2. Vite 优势
- ⚡ 极速冷启动
- 🚀 快速 HMR
- 📦 按需编译

## 实践建议

1. 合理使用 composables 封装复用逻辑
2. 利用 TypeScript 提升类型安全
3. 遵循 Vue3 最佳实践

> 技术不断更新，保持学习才是王道！

---
*最后更新：2024 年 6 月*`,
  createTime: '2024-06-01',
  type: 'project',
  techStack: ['Vue 3', 'Vite', 'TypeScript', 'Pinia', 'Vue Router']
});

// 加载完成后填入数据
onMounted(async () => {
  try {
    console.log('📡 开始加载详情页数据，ID:', props.id);
    const reply = await getDetailPage(props.id);
    
    if (reply) {
      contentData.value = reply.data;
      userData.value = reply.user || { nickname: '', avatar: '' };
      console.log('✅ 详情页数据加载成功');
    }
  } catch (error) {
    console.error('❌ 详情页数据加载失败:', error);
    // getDetailPage 已经处理了 alert 提示，这里只需记录日志
    // 可选：加载失败时跳转到首页或列表页
    // router.push('/');
  }
});

// 互动状态
const isLiked = ref(false);
const isCollected = ref(false);
const likeCount = ref(128);
const collectCount = ref(45);

// 评论相关
const newComment = ref('');
const comments = ref([
  {
    id: 1,
    author: '小明同学',
    text: '写得很好，学到了很多！',
    time: '2 小时前',
    likes: 5,
    liked: false
  },
  {
    id: 2,
    author: '前端达人',
    text: 'Vite 确实比 webpack 快太多了，推荐大家试试',
    time: '5 小时前',
    likes: 12,
    liked: true
  },
  {
    id: 3,
    author: 'Vue 爱好者',
    text: '组合式 API 刚开始用有点不习惯，用多了真香',
    time: '1 天前',
    likes: 8,
    liked: false
  }
]);

// 渲染 Markdown 内容
const renderedContent = computed(() => {
  const html = marked.parse(contentData.value.content);
  return DOMPurify.sanitize(html);
});

// 方法
const goBack = () => {
  router.back();
};

const toggleLike = () => {
  isLiked.value = !isLiked.value;
  likeCount.value += isLiked.value ? 1 : -1;
};

const toggleCollect = () => {
  isCollected.value = !isCollected.value;
  collectCount.value += isCollected.value ? 1 : -1;
};

const shareContent = async () => {
  const shareData = {
    title: contentData.value.title,
    text: contentData.value.intro,
    url: window.location.href
  };
  
  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.log('分享取消');
    }
  } else {
    // 降级方案：复制链接
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板！');
    } catch (err) {
      console.error('复制失败:', err);
    }
  }
};

const scrollToComments = () => {
  commentsSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const submitComment = () => {
  if (!newComment.value.trim()) return;
  
  comments.value.unshift({
    id: Date.now(),
    author: '你',
    text: newComment.value.trim(),
    time: '刚刚',
    likes: 0,
    liked: false
  });
  
  newComment.value = '';
};

const toggleCommentLike = (index) => {
  const comment = comments.value[index];
  comment.liked = !comment.liked;
  comment.likes += comment.liked ? 1 : -1;
};

const replyToComment = (comment) => {
  newComment.value = `@${comment.author} `;
  commentsSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
</script>

<style scoped>
@import '/public/css/detail.css';
</style>
